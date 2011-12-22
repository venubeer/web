package com.baxter.blink.models;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("field")
public class Field {

	private String name;
	private String sysName;
	private String value;
	private Property properties[];
	
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
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}	
	public Property[] getProperties() {
		return properties;
	}
	public void setProperties(Property[] properties) {
		this.properties = properties;
	}
}
