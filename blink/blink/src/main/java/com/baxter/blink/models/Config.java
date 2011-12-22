package com.baxter.blink.models;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("config")
public class Config {
	
	private String name;
	private Object object;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Object getObject() {
		return object;
	}
	public void setObject(Object object) {
		this.object = object;
	}
}
