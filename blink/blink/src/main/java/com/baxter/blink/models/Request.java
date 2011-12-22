package com.baxter.blink.models;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("request")
public class Request {

	private String statefull;
	private String stateId;
	private Config config;
	
	public String getStatefull() {
		return statefull;
	}
	public void setStatefull(String statefull) {
		this.statefull = statefull;
	}
	public String getStateId() {
		return stateId;
	}
	public void setStateId(String stateId) {
		this.stateId = stateId;
	}
	public Config getConfig() {
		return config;
	}
	public void setConfig(Config config) {
		this.config = config;
	}
}
