package com.baxter.blink.controllers;


import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger; 
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.baxter.blink.models.Config;
import com.baxter.blink.models.Request;
import com.baxter.blink.models.Response;
import com.baxter.blink.services.config.ConfigurationService;
import com.baxter.blink.services.siebel.SiebelService;
import com.baxter.common.utilities.StringUtil;

/**
 * Handles requests for the siebel related tasks.
 */
@Controller
@RequestMapping(value="/data/siebel")
public class SiebelController {

	private static final Logger logger = LoggerFactory.getLogger(SiebelController.class);

	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value="")
	public String home() {
		logger.info("Welcome home!");
		return "siebel/home";
	}
	
	/**
	 * Simply selects the Siebel home view to render.
	 */
	@RequestMapping(value="/connect")
	public ModelAndView connect(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String stateId = SiebelService.connect(request);
			Response response = new Response();		
			response.setStateId(stateId);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	/**
	 * Simply selects the Siebel home view to render.
	 */
	@RequestMapping(value="/disconnect")
	public ModelAndView disconnect(HttpServletRequest request) throws Exception {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String stateId = request.getParameter("stateId");
			if (StringUtil.isEmpty(stateId)){
				throw new Exception("Required parameters not found in request. stateId is a required parameter.");
			}			
			SiebelService.disconnect(request, stateId);
			Response response = new Response();		
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
		
	/**
	 * Query Siebel BO by Id.
	 * */
	@RequestMapping(value="/queryById", method=RequestMethod.GET)
	public ModelAndView queryById(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			if (StringUtil.isEmpty(request.getParameter("id"))){
				throw new Exception("Required parameters not found in request. id is a required parameter.");
			}
			String body = request.getParameter("request");
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			if (config.getObject().getComponents().length > 1) {
				throw new Exception ("Invalid User Configuration passed. Only one Component per Object per query request.");
			}
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.queryById(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	
	/**
	 * Query Siebel BO by Search Spec.
	 */
	@RequestMapping(value="/query", method=RequestMethod.GET)
	public ModelAndView query(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			if (config.getObject().getComponents().length > 1) {
				throw new Exception ("Invalid User Configuration passed. Only one Component per Object per query request.");
			}
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.query(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	
	/**
	 * Query Siebel BO by Search Spec, this always expects paging, page and pageSize parameters have to be passed.
	 */
	@RequestMapping(value="/queryByPage", method=RequestMethod.GET)
	public ModelAndView queryByPage(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String method = request.getParameter("method");
			if (StringUtil.isEmpty(method) || (!method.equals("open") && !method.equals("getPage") && !method.equals("close"))) {
				throw new Exception("Required parameters not found or incorrect in request. method is a required parameter. Valid values are open, getPage, close.");
			}
			if (method.equals("open")) {
				String body = request.getParameter("request");
				if (StringUtil.isEmpty(body)){
					throw new Exception("Required parameters not found in request. request is a required parameter.");
				}
				JsonFactory factory = new JsonFactory(); 
				ObjectMapper objectMapper = new ObjectMapper(factory);
				TypeReference<Request> typeRef = new TypeReference<Request>(){};
				Request req = objectMapper.readValue(body, typeRef);
				Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
				if (config.getObject().getComponents().length > 1) {
					throw new Exception ("Invalid User Configuration passed. Only one Component per Object per query request.");
				}
				Request newReq = new Request();
				newReq.setConfig(config);
				String stateId = SiebelService.connect(request);
				newReq.setStateId(stateId);
				SiebelService.queryByPage(request, newReq);
				Response response = new Response();		
				response.setStateId(stateId);
				response.setStatus("0");
				mav.addObject("response",response);
			}
			else if (method.equals("getPage")) {
				String stateId = request.getParameter("stateId");
				if (StringUtil.isEmpty(stateId)){
					throw new Exception("Required parameters not found in request. stateId is a required parameter.");
				}
				com.baxter.blink.models.Object object = SiebelService.queryByPage(request, new Request());
				Response response = new Response();		
				response.setObject(object);
				response.setStateId(stateId);
				response.setStatus("0");
				mav.addObject("response",response);
			}
			else if (method.equals("close")) {
				String stateId = request.getParameter("stateId");
				if (StringUtil.isEmpty(stateId)){
					throw new Exception("Required parameters not found in request. stateId is a required parameter.");
				}
				SiebelService.queryByPage(request, new Request());
				Response response = new Response();		
				response.setStatus("0");
				mav.addObject("response",response);
			}
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	
	/**
	 * Insert into Siebel
	 */
	@RequestMapping(value="/insert", method=RequestMethod.POST)
	public ModelAndView insert(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.insert(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	
	/**
	 * Update parent and child records.
	 */
	@RequestMapping(value="/update", method=RequestMethod.POST)
	public ModelAndView update(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.update(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			e.printStackTrace();
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	/**
	 * If record found update, else insert. If parent not found then insert parent, and children, else try to update children if exists else insert children.
	 */
	@RequestMapping(value="/upsert", method=RequestMethod.POST)
	public ModelAndView upsert(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.upsert(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	/**
	 * Delete both parent records. Siebel should delete all the affiliated/children records.
	 */
	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public ModelAndView delete(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.delete(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	/**
	 * Delete record in child component only, this retains parent record. Should be used for affiliation deletes only.
	 */
	@RequestMapping(value="/deleteChild", method=RequestMethod.POST)
	public ModelAndView deleteChild(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.deleteChild(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
	
	/**
	 * Invoke Business Service.
	 */
	@RequestMapping(value="/invoke")
	public ModelAndView invoke(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("siebel/data");
		try {
			String body = request.getParameter("request");
			if (StringUtil.isEmpty(body)){
				throw new Exception("Required parameters not found in request. request is a required parameter.");
			}
			JsonFactory factory = new JsonFactory(); 
			ObjectMapper objectMapper = new ObjectMapper(factory);
			TypeReference<Request> typeRef = new TypeReference<Request>(){};
			Request req = objectMapper.readValue(body, typeRef);
			Config config = ConfigurationService.getExecutableConfiguration(req.getConfig());
			Request newReq = new Request();
			newReq.setConfig(config);
			newReq.setStateId(req.getStateId());
			com.baxter.blink.models.Object object = SiebelService.invoke(request, newReq);
			Response response = new Response();		
			response.setObject(object);
			response.setStatus("0");
			mav.addObject("response",response);
			return mav;
		}
		catch (Exception e) {
			Response response = new Response();
			response.setStatus("1");
			response.setError(e.getMessage());
			mav.addObject("response",response);
			return mav;
		}
	}
}

