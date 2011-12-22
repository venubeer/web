package com.baxter.blink.controllers;

import org.slf4j.Logger; 
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Handles requests for Authentication.
 */
@Controller
@RequestMapping(value="auth/*") 
public class AuthenticationController {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

	/**
	 * This is a redirect for login form, when not authenticated.
	 */
	@RequestMapping(value="needed")
	public ResponseEntity<String> authRequired() {
		logger.info("Authentication Required");
		return new ResponseEntity<String>("Authentication Required", HttpStatus.UNAUTHORIZED);
	}
	
	/**
	 * This is a redirect by the container, when authentication fails.
	 */
	@RequestMapping(value="failed")
	public ResponseEntity<String> authFailed() {
		logger.info("Authentication Failed");
		return new ResponseEntity<String>("Authentication Failed", HttpStatus.UNAUTHORIZED);
	}
	
	/**
	 * Logoff mapping.
	 */
	@RequestMapping(value="logoff")
	public String authLogOff() {
		logger.info("Authentication Log Off");
		return "logoff";
	}
	
	/**
	 * Logon mapping.
	 */
	@RequestMapping(value="login")
	public String authLogin() {
		logger.info("Authentication Logon");
		return "login";
	}
}

