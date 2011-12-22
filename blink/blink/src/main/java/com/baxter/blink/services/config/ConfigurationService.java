package com.baxter.blink.services.config;

import java.sql.Clob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.baxter.blink.models.Component;
import com.baxter.blink.models.Config;
import com.baxter.blink.models.Criteria;
import com.baxter.blink.models.Field;
import com.baxter.blink.models.Filter;
import com.baxter.common.config.QueryFinder;
import com.baxter.common.dataaccess.DbConnector;
import com.baxter.common.security.User;
import com.baxter.common.utilities.StringUtil;

public class ConfigurationService {

	@SuppressWarnings("unused")
	private static final Logger logger = LoggerFactory.getLogger(ConfigurationService.class);
	
	public static Config getServerConfiguration(Config userConfig) throws Exception {
		if (StringUtil.isEmpty(userConfig.getName())) {
			throw new Exception ("Configuration name is empty. Valid name should be provided to fetch the Server Configuration.");
		}
		Config serverConfig = new Config();
		User user=new User();
		DbConnector connector = new DbConnector();
		connector.connect(user);
		Connection connection = connector.getConnection();
		PreparedStatement cusPrep = null;
		ResultSet results = null;
		try {
			String query = QueryFinder.getQuery("config/query_config.sql");
			cusPrep = connection.prepareStatement(query);
			cusPrep.setString(1,userConfig.getName());
			cusPrep.setString(2,"SIEBEL");
		    results = cusPrep.executeQuery();
			if (results.next()){
				Clob content = results.getClob("CONTENT");
				try {
					JsonFactory factory = new JsonFactory(); 
					ObjectMapper objectMapper = new ObjectMapper(factory);
					TypeReference<Config> typeRef = new TypeReference<Config>(){};
					serverConfig = objectMapper.readValue(content.getSubString(1,(int)content.length()), typeRef);
				}
				catch (Exception e) {
					throw new Exception ("Error parsing Server Configuration. Error information: "+e.getMessage());
				}
			}
			else {
				throw new Exception ("Siebel Server Configuration was not found for the User Configuration.");
			}
		}
		catch (Exception e) {
			throw new Exception ("Unknown error fetching Server Configuration. Error information: "+e.getMessage());
		}
		finally {
			if (results!=null){
				results.close();
			}
			if (cusPrep!=null){
				cusPrep.close();
			}
			connector.disconnect();
		}
		return serverConfig;
	}
	
	
	public static Config getExecutableConfiguration(Config userConfig) throws Exception {
		return getExecutableConfiguration(getServerConfiguration(userConfig), userConfig);
	}
	
	
	public static Config getExecutableConfiguration(Config serverConfig, Config userConfig) throws Exception {
		com.baxter.blink.models.Object serverObject = serverConfig.getObject();
		com.baxter.blink.models.Object userObject = userConfig.getObject();
		if (userObject == null){
			return serverConfig;
		}
		if (!StringUtil.isEmpty(userObject.getName()) && 
				!StringUtil.isEmpty(serverObject.getName()) &&
				!serverObject.getName().equals(userObject.getName())) {
			throw new Exception ("Configuration passed in does not match Server Configuration.");
		}
		userObject.setSysName(serverObject.getSysName());
		Component[] serverComponents = serverObject.getComponents();
		Component[] userComponents = userObject.getComponents();
		if (serverComponents == null || serverComponents.length==0) {
			throw new Exception ("Server Configuration is not setup correctly.");
		}
		if ((userComponents == null || userComponents.length==0) && serverComponents != null && serverComponents.length==1 ){
			return serverConfig;
		}
		for (int i=0;i<userComponents.length;i++){
			boolean componentExists = false;
			for (int j=0;j<serverComponents.length;j++) {
				if (!StringUtil.isEmpty(userComponents[i].getName()) && 
						!StringUtil.isEmpty(serverComponents[j].getName()) &&
						serverComponents[j].getName().equals(userComponents[i].getName())) {
					validateComponent(userComponents[i],serverComponents[j]);
					componentExists = true;
					break;
				}
			}
			if (!componentExists) {
				throw new Exception ("Object Component Configuration passed in does not match Server Configuration.");
			}
		}
		return userConfig;
	}
	
	
	private static void validateComponent(Component userComponent, Component serverComponent) throws Exception {
		if (!StringUtil.isEmpty(userComponent.getName()) && 
				!StringUtil.isEmpty(serverComponent.getName()) &&
				!serverComponent.getName().equals(userComponent.getName())) {
			throw new Exception ("Object Component Configuration passed in does not match Server Configuration.");
		}
		userComponent.setSysName(serverComponent.getSysName());
		//validate fields
		if (userComponent.getFields() != null && userComponent.getFields().length > 0){
			if (serverComponent.getFields() == null || serverComponent.getFields().length == 0){
				throw new Exception ("Server Configuration is not setup correctly. Object Component "+serverComponent.getName()+" has no fields defined.");
			}
			for (int i=0;i<userComponent.getFields().length;i++) {
				boolean fieldExists = false;
				if (StringUtil.isEmpty(userComponent.getFields()[i].getName())) {
					throw new Exception ("Fields for Component "+userComponent.getName()+" has a null name property");
				}
				for (int j=0;j<serverComponent.getFields().length;j++) {
					if (userComponent.getFields()[i].getName().equals(serverComponent.getFields()[j].getName())){
						Field field = new Field();
						field.setName(serverComponent.getFields()[j].getName());
						field.setSysName(serverComponent.getFields()[j].getSysName());
						field.setValue(userComponent.getFields()[i].getValue());
						field.setProperties(serverComponent.getFields()[j].getProperties());
						userComponent.getFields()[i]=field;
						fieldExists = true;
						break;
					}
				}
				if (!fieldExists) {
					throw new Exception ("Field "+ userComponent.getFields()[i].getName()+" for Component "+userComponent.getName()+" is not defined in Server Configuration.");
				}
			}
		}
		else {
			userComponent.setFields(serverComponent.getFields());
		}
		//overwrite userComponent with serverComponent defined Properties. 
		userComponent.setProperties(serverComponent.getProperties());
		//validate filters
		validateFilters(userComponent, serverComponent);
		//validate components
		if (userComponent.getComponents() != null && userComponent.getComponents().length > 0){
			if (serverComponent.getComponents()==null || serverComponent.getComponents().length == 0){
				throw new Exception ("Server configuration has no Child Compnents defined. User Configuration has atleast one Child Component defined. ");
			}
			for (int i=0;i<userComponent.getComponents().length;i++){
				boolean compExists = false;
				for (int j=0;j<serverComponent.getComponents().length;j++){
					if (userComponent.getComponents()[i].getName().equals(serverComponent.getComponents()[j].getName())){
						validateComponent(userComponent.getComponents()[i],serverComponent.getComponents()[j]);
						compExists = true;
					}
				}
				if (!compExists) {
					throw new Exception ("Component "+ userComponent.getComponents()[i].getName()+ " is not defined in Server Configuration.");
				}
			}
				
		}
	}
	
	
	private static void validateFilters(Component userComponent, Component serverComponent) throws Exception{
		Filter[] userFilters = userComponent.getFilters();
		Field[] serverFields = serverComponent.getFields();
		if (userFilters==null||userFilters.length==0){
			return;
		}
		for (int i=0;i<userFilters.length;i++){
			Criteria[] criterias = userFilters[i].getCriteria();
			if (criterias==null || criterias.length==0){
				continue;
			}
			for (int j=0;j<criterias.length;j++){
				if (criterias[j].getField()==null) {
					throw new Exception ("Field property is required when submitting a Filter Criteria.");
				}
				if (StringUtil.isEmpty(criterias[j].getField().getName())) {
					throw new Exception ("Criteria Field name property is required when submitting a Filter Criteria.");
				}
				if (StringUtil.isEmpty(criterias[j].getField().getValue())) {
					throw new Exception ("Criteria Field value property is required when submitting a Filter Criteria.");
				}
				boolean fieldExists = false;
				for (int k=0;k<serverFields.length;k++){
					if (criterias[j].getField().getName().equals(serverFields[k].getName())){
						fieldExists = true;
						Field newCriteriaField = new Field();
						newCriteriaField.setName(serverFields[k].getName());
						newCriteriaField.setSysName(serverFields[k].getSysName());
						newCriteriaField.setValue(criterias[j].getField().getValue());
						newCriteriaField.setProperties(serverFields[k].getProperties());
						criterias[j].setField(newCriteriaField);
						break;
					}
				}
				if (!fieldExists){
					throw new Exception ("Invalid value for fieldName in a Criteria. Criteria can only be built on using Fields within the Component.");
				}
			}
		}
	}
}
