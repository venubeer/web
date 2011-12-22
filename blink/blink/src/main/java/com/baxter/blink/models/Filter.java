package com.baxter.blink.models;

import com.thoughtworks.xstream.annotations.XStreamAlias;

@XStreamAlias("filter")
public class Filter {
	
	private Criteria[] criteria;

	public void setCriteria(Criteria[] criteria) {
		this.criteria = criteria;
	}

	public Criteria[] getCriteria() {
		return criteria;
	}
	
	
}
