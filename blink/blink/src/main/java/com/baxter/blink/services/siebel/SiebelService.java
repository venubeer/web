package com.baxter.blink.services.siebel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;
import java.util.Properties;
import java.util.StringTokenizer;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.baxter.blink.models.Component;
import com.baxter.blink.models.Criteria;
import com.baxter.blink.models.Field;
import com.baxter.blink.models.Filter;
import com.baxter.blink.models.Property;
import com.baxter.blink.models.Request;
import com.baxter.blink.models.Response;
import com.baxter.common.dataaccess.Database;
import com.baxter.common.security.User;
import com.baxter.common.utilities.StringUtil;
import com.siebel.data.SiebelBusComp;
import com.siebel.data.SiebelBusObject;
import com.siebel.data.SiebelDataBean;
import com.siebel.data.SiebelException;
import com.siebel.data.SiebelPropertySet;


public class SiebelService {
	
	@SuppressWarnings("unused")
	private static final Logger logger = LoggerFactory.getLogger(SiebelService.class);
	
	public static String connect(HttpServletRequest request) throws Exception {
		SiebelDataBean sblbean = new SiebelDataBean();
		User user = new User();
		Database database = user.getDatabase();
		Properties dbProps = database.getProperties();
		@SuppressWarnings("unchecked")
		Hashtable<String, SiebelDataBean> connections = (Hashtable<String, SiebelDataBean>) request.getSession().getAttribute("blink.siebel.connections");
		if (connections==null) {
			connections = new Hashtable<String, SiebelDataBean>();
		}
		if (connections.size() >=10) {
			throw new Exception("Maximum number of statefull connections exceded. Only 10 statefull connections can be opened at a given time.");
		}
		String sblUserId = "siebeltest6";//(String) request.getSession().getAttribute("blink.userId");
		String sblPassword = "Password1";//(String) request.getSession().getAttribute("blink.password");
		String sblConnectString = dbProps.getProperty("sbl.connect.string");
		String sblConnectLang = dbProps.getProperty("sbl.lang")==null?"ENU":dbProps.getProperty("sbl.lang");
		if (!StringUtil.isEmpty(sblUserId) && !StringUtil.isEmpty(sblPassword)
				&&!StringUtil.isEmpty(sblConnectString)) {
			sblbean.login(sblConnectString,sblUserId,sblPassword,sblConnectLang);
		}
		else {
			throw new Exception ("Could not connect to Siebel. Invalid arguments. UserId, Password and ConnectString not supplied.");
		}
		String uuid = UUID.randomUUID().toString();
		connections.put(uuid, sblbean);
		HttpSession session = request.getSession();
		session.setAttribute("blink.siebel.connections", connections);
		return uuid;
	}
	
	
	public static SiebelDataBean getConnection(HttpServletRequest request, String stateId) throws Exception {
		String connectId=null;
		if (StringUtil.isEmpty(stateId)) {
			connectId = connect(request);
		}
		else {
			connectId = stateId;
		}
		HttpSession session = request.getSession();
		@SuppressWarnings("unchecked")
		Hashtable<String, SiebelDataBean> connections = (Hashtable<String, SiebelDataBean>) session.getAttribute("blink.siebel.connections");
		if (connections==null || !connections.containsKey(connectId)) {
			throw new Exception ("Connection with id does not exists. Provide a valid Id.");
		}
		return connections.get(connectId); 
	}
	
	
	public static void disconnect(HttpServletRequest request, String stateId) throws Exception{
		@SuppressWarnings("unchecked")
		Hashtable<String, SiebelDataBean> connections = (Hashtable<String, SiebelDataBean>) request.getSession().getAttribute("blink.siebel.connections");
		if (connections==null || !connections.containsKey(stateId)) {
			throw new Exception ("Invalid stateId. Connection not found with stateId.");
		}
		SiebelDataBean sblbean = connections.get(stateId);
		if (sblbean!=null){
			try {
				sblbean.logoff();
			}
			catch (Exception e){}
		}
		connections.remove(stateId);
		request.getSession().removeAttribute(stateId);
	}
	
	
	public static com.baxter.blink.models.Object queryById(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			SiebelDataBean sblbean = getConnection(request,connectId); 
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			Component component = req.getConfig().getObject().getComponents()[0];
			List<Filter> filterList = new ArrayList<Filter>();
			if (component.getFilters()!=null) {
				filterList.addAll(Arrays.asList(component.getFilters()));
			}
			Criteria idCrit = new Criteria();
			Field criteriaField = new Field();
			criteriaField.setName("id");
			criteriaField.setSysName("Id");
			criteriaField.setValue(request.getParameter("id"));
			idCrit.setField(criteriaField);
			Criteria[] idCrits = {idCrit};
			Filter idFilt = new Filter();
			idFilt.setCriteria(idCrits);
			filterList.add(idFilt);
			Filter[] filterArray = (Filter[])filterList.toArray(new Filter[0]);
			component.setFilters(filterArray);
			initializeForQuery(sblobject, component, sblComponents);
			object.setName(req.getConfig().getObject().getName());
			object.setComponents(buildComponent(sblobject, component, sblComponents,1,0));
			return object;
		}
		catch (Exception e){
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object query(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		String pageSize = StringUtil.isEmpty(request.getParameter("pageSize"))?"500":request.getParameter("pageSize");
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			SiebelDataBean sblbean = getConnection(request,connectId); 
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			Component component = req.getConfig().getObject().getComponents()[0];
			initializeForQuery(sblobject, component, sblComponents);
			object.setName(req.getConfig().getObject().getName());
			object.setComponents(buildComponent(sblobject, component, sblComponents,(new Integer(pageSize)).intValue(),0));
			return object;
		}
		catch (Exception e){
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static com.baxter.blink.models.Object queryByPage(HttpServletRequest request, Request req) throws Exception {
		String pageSize = StringUtil.isEmpty(request.getParameter("pageSize"))?"500":request.getParameter("pageSize");
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		HttpSession session = request.getSession();
		try {
			if (request.getParameter("method").equals("open")){
				String connectId=null;
				try {
					connectId = req.getStateId();
					SiebelDataBean sblbean = getConnection(request,connectId); 
					SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
					Component component = req.getConfig().getObject().getComponents()[0];
					initializeForQuery(sblobject, component, sblComponents);
					Hashtable store = new Hashtable();
					store.put("userReq", req);
					store.put("object", sblobject);
					store.put("component", component);
					store.put("sblComponents", sblComponents);
					store.put("pageSize", pageSize);
					session.setAttribute(connectId, store);
					return object;
				}
				catch(Exception e) {
					disconnect(request,connectId);
					throw e;
				}
			}
			else if (request.getParameter("method").equals("getPage")){
				Hashtable store = (Hashtable) session.getAttribute(request.getParameter("stateId"));
				if (store==null){
					throw new Exception ("Object not initialized. Use method=open parameter to initialize and send a valid StateId.");
				}
				object.setName(((Request)store.get("userReq")).getConfig().getObject().getName());
				object.setComponents(buildComponent((SiebelBusObject)store.get("object"), 
													(Component)store.get("component"), 
													(Hashtable<String, SiebelBusComp>) store.get("sblComponents"),
													(new Integer((String)store.get("pageSize"))).intValue(),0));
				return object;
			}
			else if (request.getParameter("method").equals("close")){
				disconnect(request,request.getParameter("stateId"));
				return object;
			}
			throw new Exception ("Invalid method parameter passed in to the queryPage method. Valid methods are open, getPage, close.");
		}
		catch (Exception e){
			throw e;
		}
	}
	
	
	public static com.baxter.blink.models.Object insert(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		SiebelDataBean sblbean=null;
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		List<Component> newComponentList = new ArrayList<Component>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			sblbean = getConnection(request,connectId); 
			startTransaction(sblbean);
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			for (int i=0;i<req.getConfig().getObject().getComponents().length;i++){
				newComponentList.add(insert(sblobject, req.getConfig().getObject().getComponents()[i],sblComponents));
			}
			commitTransaction(sblbean);
			object.setComponents((Component[])newComponentList.toArray(new Component[0]));
			return object;
		}
		catch (Exception e){
			rollbackTransaction(sblbean);
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object update(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		SiebelDataBean sblbean=null;
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		List<Component> newComponentList = new ArrayList<Component>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			sblbean = getConnection(request,connectId); 
			startTransaction(sblbean);
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			for (int i=0;i<req.getConfig().getObject().getComponents().length;i++){
				Component component = update(sblobject, req.getConfig().getObject().getComponents()[i],sblComponents,false);
				if (component==null){
					throw new Exception ("Record "+i+" could not be updated. Record was not found to be updated.");
				}
				newComponentList.add(component);
			}
			commitTransaction(sblbean);
			object.setComponents((Component[])newComponentList.toArray(new Component[0]));
			return object;
		}
		catch (Exception e){
			rollbackTransaction(sblbean);
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object upsert(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		SiebelDataBean sblbean=null;
		com.baxter.blink.models.Object object = new com.baxter.blink.models.Object();
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		List<Component> newComponentList = new ArrayList<Component>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			sblbean = getConnection(request,connectId); 
			startTransaction(sblbean);
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			for (int i=0;i<req.getConfig().getObject().getComponents().length;i++){
				Component component = update(sblobject, req.getConfig().getObject().getComponents()[i],sblComponents,true);
				newComponentList.add(component);
			}
			commitTransaction(sblbean);
			object.setComponents((Component[])newComponentList.toArray(new Component[0]));
			return object;
		}
		catch (Exception e){
			rollbackTransaction(sblbean);
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object delete(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		SiebelDataBean sblbean=null;
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			sblbean = getConnection(request,connectId); 
			startTransaction(sblbean);
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			for (int i=0;i<req.getConfig().getObject().getComponents().length;i++){
				String noDelete = getPropertyValue(req.getConfig().getObject().getComponents()[i].getProperties(),"NoDelete");
				if (noDelete!=null && noDelete.equalsIgnoreCase("true")) {
					throw new Exception ("No Deletes allowed for Component "+req.getConfig().getObject().getComponents()[i].getName());
				}
				SiebelBusComp sblcomp = sblComponents.get(req.getConfig().getObject().getComponents()[i].getSysName());
				if (sblcomp==null){
					sblcomp = sblobject.getBusComp(req.getConfig().getObject().getComponents()[i].getSysName());
					sblComponents.put(req.getConfig().getObject().getComponents()[i].getSysName(), sblcomp);
				}
				if (findById(sblcomp,req.getConfig().getObject().getComponents()[i]) ||
						findByUserKey(sblcomp,req.getConfig().getObject().getComponents()[i])){
					sblcomp.deleteRecord();
				}
				else {
					throw new Exception ("Record "+i+" could not be deleted. Record was not found to be deleted.");
				}
			}
			commitTransaction(sblbean);
			return null;
		}
		catch (Exception e){
			rollbackTransaction(sblbean);
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object deleteChild(HttpServletRequest request, Request req) throws Exception {
		String connectId=null;
		SiebelDataBean sblbean=null;
		Hashtable<String, SiebelBusComp> sblComponents = new Hashtable<String, SiebelBusComp>();
		HttpSession session = request.getSession();
		try {
			if (StringUtil.isEmpty(req.getStateId())) {
				connectId = connect(request);
			}
			else {
				connectId = req.getStateId();
			}
			sblbean = getConnection(request,connectId); 
			startTransaction(sblbean);
			session.removeAttribute(connectId);
			SiebelBusObject sblobject = sblbean.getBusObject(req.getConfig().getObject().getSysName());
			for (int i=0;i<req.getConfig().getObject().getComponents().length;i++){
				deleteChild(sblobject, req.getConfig().getObject().getComponents()[i],sblComponents);
			}
			commitTransaction(sblbean);
			return null;
		}
		catch (Exception e){
			rollbackTransaction(sblbean);
			throw e;
		}
		finally {
			closeAllSblBusComps(sblComponents);			
			if (connectId!=null && StringUtil.isEmpty(req.getStateId())) {
				disconnect(request,connectId);
			}
		}
	}
	
	
	public static com.baxter.blink.models.Object invoke(HttpServletRequest request, Request req) throws Exception {
		return null;
	}
	
	
	private static boolean findById(SiebelBusComp sblComponent, Component component) throws Exception {
		SiebelPropertySet fieldset = fieldsToSiebelPropertySet(component,"find");
		String searchSpec = buildSearchSpec(component);
		String viewMode = getPropertyValue(component.getProperties(),"ViewMode");
		if (!StringUtil.isEmpty(fieldset.getProperty("Id"))) {
			searchSpec = StringUtil.isEmpty(searchSpec)?"Id=\""+fieldset.getProperty("Id")+"\"":searchSpec+" AND Id=\""+fieldset.getProperty("Id")+"\"";
			sblComponent.clearToQuery();
			if (!StringUtil.isEmpty(viewMode)){
				sblComponent.setViewMode((new Integer(viewMode)).intValue());
			}
			sblComponent.setSearchExpr(searchSpec);
			sblComponent.activateMultipleFields(fieldsToSiebelPropertySet(component,"query"));
			sblComponent.executeQuery(true);
			boolean found = sblComponent.firstRecord();
			if (found) {
				return true;
			}
		}
		return false;
	}
	
	
	private static boolean findByUserKey(SiebelBusComp sblComponent, Component component) throws Exception {
		SiebelPropertySet fieldset = fieldsToSiebelPropertySet(component,"find");
		String searchSpec = buildSearchSpec(component);
		String viewMode = getPropertyValue(component.getProperties(),"ViewMode");
		String userKeys = getPropertyValue(component.getProperties(), "UserKeys");
		if (!StringUtil.isEmpty(userKeys)) {
			StringTokenizer strToknzr = new StringTokenizer(userKeys, ",");
			while (strToknzr.hasMoreElements()){
				if (!StringUtil.isEmpty(searchSpec)) {
					searchSpec = searchSpec+" AND ";
				}
				String token = strToknzr.nextToken();
				if (!StringUtil.isEmpty(fieldset.getProperty(token))) {
					searchSpec=searchSpec+token+"=\""+fieldset.getProperty(token)+"\"";
				}
				else {
					searchSpec=searchSpec+token+" IS NULL";
				}
			}
			sblComponent.clearToQuery();
			if (!StringUtil.isEmpty(viewMode)){
				sblComponent.setViewMode((new Integer(viewMode)).intValue());
			}
			sblComponent.setSearchExpr(searchSpec);
			sblComponent.activateMultipleFields(fieldsToSiebelPropertySet(component,"query"));
			sblComponent.executeQuery(true);
			boolean found = sblComponent.firstRecord();
			if (found) {
				return true;
			}
		}
		return false;
	}
	
	
	private static Component insert(SiebelBusObject sblobject, Component component, Hashtable<String, SiebelBusComp> sblComponents)  throws Exception {
		String noInsert = getPropertyValue(component.getProperties(),"NoInsert");
		if (noInsert!=null && noInsert.equalsIgnoreCase("true")) {
			throw new Exception ("No Inserts allowed for Component "+component.getName());			
		}
		Component newComponent = new Component();
		SiebelBusComp sblcomp = (SiebelBusComp) sblComponents.get(component.getSysName());
		if (sblcomp==null){
			sblcomp = sblobject.getBusComp(component.getSysName());
		}
		String isAssoc = getPropertyValue(component.getProperties(),"Association");
		if (isAssoc!=null && isAssoc.equalsIgnoreCase("true")) {
			SiebelBusComp assocComp = sblcomp.getAssocBusComp();
			if (findById(assocComp,component) ||
					findByUserKey(assocComp,component)) {
				assocComp.associate(true);
			}
			else {
				assocComp.newRecord(false);
				assocComp.setMultipleFieldValues((fieldsToSiebelPropertySet(component,"non-query")));
				if (component.getComponents() != null && component.getComponents().length > 0){
					for (int i=0;i<component.getComponents().length;i++){
						String mvgField = getPropertyValue(component.getComponents()[i].getProperties(),"MVG");
						if (mvgField!=null){
							SiebelBusComp mvgComp = assocComp.getMVGBusComp(mvgField);
							sblComponents.put(component.getComponents()[i].getSysName(), mvgComp);
							insert(sblobject,component.getComponents()[i],sblComponents);
						}
					}
				}
				assocComp.writeRecord();
				assocComp.associate(true);
			}
		}
		else {
			sblcomp.newRecord(false);
			sblcomp.setMultipleFieldValues((fieldsToSiebelPropertySet(component,"non-query")));
			if (component.getComponents() != null && component.getComponents().length > 0){
				for (int i=0;i<component.getComponents().length;i++){
					String mvgField = getPropertyValue(component.getComponents()[i].getProperties(),"MVG");
					if (mvgField!=null){
						SiebelBusComp mvgComp = sblcomp.getMVGBusComp(mvgField);
						sblComponents.put(component.getComponents()[i].getSysName(), mvgComp);
						insert(sblobject,component.getComponents()[i],sblComponents);
					}
				}
			}
			sblcomp.writeRecord();
		}
		newComponent.setName(component.getName());
		Field[] fields = new Field[component.getFields().length];
		for (int i=0;i<component.getFields().length;i++){
			Field field = new Field();
			field.setName(component.getFields()[i].getName());
			field.setValue(sblcomp.getFieldValue(component.getFields()[i].getSysName()));
			fields[i]=field;
		}
		newComponent.setFields(fields);
		if (component.getComponents() != null && component.getComponents().length > 0){
			List<Component> newComponentList = new ArrayList<Component>();
			for (int i=0;i<component.getComponents().length;i++){
				String mvgField = getPropertyValue(component.getComponents()[i].getProperties(),"MVG");
				if (mvgField==null){
					newComponentList.add(insert(sblobject,component.getComponents()[i],sblComponents));
				}
			}
			newComponent.setComponents((Component[])newComponentList.toArray(new Component[0]));
		}
		return newComponent;
	}
	
	
	private static Component update(SiebelBusObject sblobject, Component component, Hashtable<String, SiebelBusComp> sblComponents, boolean upsert) throws Exception {
		String noUpdate = getPropertyValue(component.getProperties(),"NoUpdate");
		if (noUpdate!=null && noUpdate.equalsIgnoreCase("true")) {
			throw new Exception ("No Updates allowed for Component "+component.getName());			
		}
		Component newComponent = new Component();
		SiebelBusComp sblcomp = (SiebelBusComp) sblComponents.get(component.getSysName());
		if (sblcomp==null){
			sblcomp = sblobject.getBusComp(component.getSysName());
		}
		if (findById(sblcomp,component) ||
				findByUserKey(sblcomp,component)){
			sblcomp.setMultipleFieldValues((fieldsToSiebelPropertySet(component,"non-query")));
			sblcomp.writeRecord();
			newComponent.setName(component.getName());
			Field[] fields = new Field[component.getFields().length];
			for (int i=0;i<component.getFields().length;i++){
				Field field = new Field();
				field.setName(component.getFields()[i].getName());
				field.setValue(sblcomp.getFieldValue(component.getFields()[i].getSysName()));
				fields[i]=field;
			}
			newComponent.setFields(fields);
			if (component.getComponents() != null && component.getComponents().length > 0){
				List<Component> newComponentList = new ArrayList<Component>();
				for (int i=0;i<component.getComponents().length;i++){
					newComponentList.add(update(sblobject,component.getComponents()[i],sblComponents,upsert));
				}
				newComponent.setComponents((Component[])newComponentList.toArray(new Component[0]));
			}
			return newComponent;
		}
		else if (upsert){
			return insert(sblobject,component,sblComponents);
		}
		else {
			throw new Exception ("Update not allowed. Row could not be found for update.");
		}		
	}
	
	private static void deleteChild(SiebelBusObject sblobject, Component component, Hashtable<String, SiebelBusComp> sblComponents) throws Exception {
		SiebelBusComp sblcomp = sblComponents.get(component.getSysName());
		if (sblcomp==null){
			sblcomp = sblobject.getBusComp(component.getSysName());
			sblComponents.put(component.getSysName(), sblcomp);
		}
		if (findById(sblcomp,component) ||
				findByUserKey(sblcomp,component)){
			
		}
		else {
			return;
		}
		if (component.getComponents()==null ||component.getComponents().length==0) {
			String noDelete = getPropertyValue(component.getProperties(),"NoDelete");
			if (noDelete!=null && noDelete.equalsIgnoreCase("true")) {
				throw new Exception ("No Deletes allowed for Component "+component.getName());
			}
			sblcomp.deleteRecord();
		}
		else {
			for (int i=0;i<component.getComponents().length;i++){
				deleteChild(sblobject,component.getComponents()[i],sblComponents);
			}
		}
	}
	
	
	
	private static void startTransaction(SiebelDataBean sblbean) throws Exception {
		SiebelPropertySet BSInput = new SiebelPropertySet();
		SiebelPropertySet BSOutput = new SiebelPropertySet();
		com.siebel.data.SiebelService sblService = sblbean.getService("EAI Transaction Service");
		sblService.invokeMethod("IsInTransaction",BSInput,BSOutput);
		if (BSOutput.getProperty("IsInTransaction").equalsIgnoreCase("false")) {
			BSOutput = new SiebelPropertySet();
			sblService.invokeMethod("BeginTransaction",BSInput,BSOutput);
		}
	}
	
	
	private static void commitTransaction(SiebelDataBean sblbean) throws Exception  {
		SiebelPropertySet BSInput = new SiebelPropertySet();
		SiebelPropertySet BSOutput = new SiebelPropertySet();
		com.siebel.data.SiebelService sblService = sblbean.getService("EAI Transaction Service");
		sblService.invokeMethod("IsInTransaction",BSInput,BSOutput);
		if (BSOutput.getProperty("IsInTransaction").equalsIgnoreCase("true")) {
			BSOutput = new SiebelPropertySet();
			sblService.invokeMethod("EndTransaction",BSInput,BSOutput);
		}
	}
	
	
	private static void rollbackTransaction(SiebelDataBean sblbean) throws Exception  {
		SiebelPropertySet BSInput = new SiebelPropertySet();
		SiebelPropertySet BSOutput = new SiebelPropertySet();
		com.siebel.data.SiebelService sblService = sblbean.getService("EAI Transaction Service");
		sblService.invokeMethod("IsInTransaction",BSInput,BSOutput);
		if (BSOutput.getProperty("IsInTransaction").equalsIgnoreCase("true")) {
			BSInput = new SiebelPropertySet();
			BSInput.setProperty("Is Abort", "True");
			sblService.invokeMethod("EndTransaction",BSInput,BSOutput);
		}
	}
	
	
	private static Component[] buildComponent(SiebelBusObject sblobject, Component component, Hashtable<String, SiebelBusComp> sblComponents, int numRows, int level) throws Exception {
		SiebelBusComp sblcomp = (SiebelBusComp) sblComponents.get(component.getSysName());
		if (sblcomp==null && level==0){
			return null;
		}
		else if (sblcomp==null && level>0){
			initializeForQuery(sblobject, component, sblComponents);
			sblcomp = (SiebelBusComp) sblComponents.get(component.getSysName());
			if (sblcomp==null){
				return null;
			}
		}
		List<Component> newComponentList = new ArrayList<Component>();
		boolean found = true;
		if (level>0) {
			found = sblcomp.firstRecord();
		}
		int recordCount = 0;
		while (found && (numRows<0||recordCount<numRows)) {
			recordCount++;
			Component newComponent = new Component();
			newComponent.setName(component.getName());
			Field[] fields = component.getFields();
			List<Field> newFieldList = new ArrayList<Field>();
			for (int i=0;i<fields.length;i++){
				Field newField = new Field();
				newField.setName(fields[i].getName());
				newField.setValue(sblcomp.getFieldValue(fields[i].getSysName()));
				newFieldList.add(newField);
			}
			newComponent.setFields((Field[])newFieldList.toArray(new Field[0]));
			if (component.getComponents()!=null){
				List<Component> newChildComponentList = new ArrayList<Component>();
				for (int i=0;i<component.getComponents().length;i++){
					Component[] chldComponents = buildComponent(sblobject,component.getComponents()[i], sblComponents, -1, level+1);
					if (chldComponents != null){
						newChildComponentList.addAll(Arrays.asList(chldComponents));		
					}
				}
				newComponent.setComponents((Component[])newChildComponentList.toArray(new Component[0]));
			}
			newComponentList.add(newComponent);
			try {
				found = sblcomp.nextRecord();
			}
			catch (SiebelException e){
				if (e.getMessage().indexOf("SBL-DAT-00393") > 0){
					if (level==0){
						closeAllSblBusComps(sblComponents);
					}
					break;
				}
				else {
					throw e;
				}
			}
		}
		return (Component[])newComponentList.toArray(new Component[0]);
	}
	
	
	private static void initializeForQuery(SiebelBusObject sblobject, Component component, Hashtable<String, SiebelBusComp> sblComponents) throws Exception {
		SiebelBusComp sblcomp = sblobject.getBusComp(component.getSysName());
		sblcomp.clearToQuery();
		String viewMode = getPropertyValue(component.getProperties(),"ViewMode");
		if (!StringUtil.isEmpty(viewMode)){
			sblcomp.setViewMode((new Integer(viewMode)).intValue());
		}
		String searchSpec = buildSearchSpec(component);
		if (!StringUtil.isEmpty(searchSpec)){
			sblcomp.setSearchExpr(searchSpec);
		}
		sblcomp.activateMultipleFields(fieldsToSiebelPropertySet(component,"query"));
		sblcomp.executeQuery(true);
		boolean found = sblcomp.firstRecord();
		if (found) {
			sblComponents.put(component.getSysName(), sblcomp);
			if (component.getComponents()!=null){
				for (int i=0;i<component.getComponents().length;i++){
					initializeForQuery(sblobject, component.getComponents()[i],sblComponents);
				}
			}
		}
	}
	
	
	private static SiebelPropertySet fieldsToSiebelPropertySet(Component component, String mode) throws Exception {
		SiebelPropertySet fieldList = new SiebelPropertySet();
		if (component!=null && component.getFields()!=null){
			for (int i=0;i<component.getFields().length;i++){
				if (mode.equals("query")){
					fieldList.setProperty(component.getFields()[i].getSysName(), "");
				}
				else if (mode.equals("non-query")) {
					String skipUpdate = getPropertyValue(component.getFields()[i].getProperties(),"SkipUpdate");
					if (skipUpdate==null || !skipUpdate.equalsIgnoreCase("true")) {
						fieldList.setProperty(component.getFields()[i].getSysName(), component.getFields()[i].getValue()==null?"":component.getFields()[i].getValue());
					}
				}
				else {
					fieldList.setProperty(component.getFields()[i].getSysName(), component.getFields()[i].getValue()==null?"":component.getFields()[i].getValue());
				}
			}
		}
		return fieldList;
	}
	
	
	private static String buildSearchSpec (Component component) throws Exception {
		StringBuffer spec = new StringBuffer();
		Filter[] filters = component.getFilters();
		if (filters!=null){
			for (int i=0;i<filters.length;i++){
				Criteria[] criterias = filters[i].getCriteria();
				if (criterias!=null && criterias.length > 0) {
					for (int j=0;j<criterias.length;j++){
						if (j == 0){
							spec.append("(");
						}
						String queryAlias = getPropertyValue(criterias[j].getField().getProperties(),"QueryAlias");
						queryAlias=queryAlias==null?criterias[j].getField().getSysName():queryAlias;
						spec.append(queryAlias+ " " +
								(StringUtil.isEmpty(criterias[j].getOperator())?"=":criterias[j].getOperator())+
								" \""+StringUtil.replace(criterias[j].getField().getValue(), "\"", "_")+"\" ");
						if (j<criterias.length-1){
							spec.append(" OR ");
						}
					}
				}
				if (criterias.length > 0){
					spec.append(")");
				}
				if (i<filters.length-1) {
					spec.append(" AND ");
				}				
			}
		}
		String serverSpec = getPropertyValue(component.getProperties(),"FilterSpec");
		if (!StringUtil.isEmpty(serverSpec)){
			if (!StringUtil.isEmpty(spec.toString())) {
				spec.append(" AND ");
			}
			spec.append("(").append(serverSpec).append(")");
		}
		return spec.toString();
	}
	
	
	private static String getPropertyValue(Property[] properties, String name){
		if (properties==null||properties.length==0){
			return null;
		}
		for (int i=0;i<properties.length;i++){
			if (properties[i].getName().equals(name)){
				return properties[i].getValue();
			}
		}
		return null;
	}
	
	
	private static void closeAllSblBusComps(Hashtable<String, SiebelBusComp> components) {
		Enumeration<String> enumers = components.keys();
		while (enumers.hasMoreElements()){
			String sblcompName = enumers.nextElement();
			SiebelBusComp sblcomp = components.get(sblcompName);
			try {				
				sblcomp.release();
			}
			catch (Exception e){}
			components.remove(sblcompName);
		}
	}
		
}
