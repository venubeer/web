package com.baxter.blink.models;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("object")
public class Object {

	private String name;
	private String sysName;
	private Component[] components;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSysName() {
		return sysName;
	}
	public void setSysName(String sysName) {
		this.sysName = sysName;
	}
	public Component[] getComponents() {
		return components;
	}
	public void setComponents(Component[] components) {
		this.components = components;
	}
	
	
}
