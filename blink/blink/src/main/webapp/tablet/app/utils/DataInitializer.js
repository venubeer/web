synchronicity.controllers.dataInitializer = new Ext.Controller({
	
	initialize: function(options){
		var thisController = this;
		if (!options.process||options.process=='Initialize') {
			Ext.getBody().mask('<div class="demos-loading">Initializing...</div>');
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Authenticating...</div>');
			options.process='Signon';
			options.subProcess='Signon';
			thisController.signon(options);
		}
		else if (options.process=='Signon' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Accounts...</div>');
			options.process='Accounts';
			options.subProcess='Start';
			thisController.accounts(options);
		}
		else if (options.process=='Accounts' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Contacts...</div>');
			options.process='Contacts';
			options.subProcess='Start';
			thisController.contacts(options);
		}
		else if (options.process=='Contacts' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Opportunities...</div>');
			options.process='Opportunities';
			options.subProcess='Start';
			thisController.opportunities(options);
		}
		else if (options.process=='Opportunities' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Activities...</div>');
			options.process='Activities';
			options.subProcess='Start';
			thisController.activities(options);
		}
		else if (options.process=='Activities' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Products...</div>');
			options.process='Products';
			options.subProcess='Start';
			thisController.products(options);
		}
		else if (options.process=='Products' && options.subProcess=='Complete') {
			Ext.getBody().unmask();	
			Ext.getBody().mask('<div class="demos-loading">Admin Data...</div>');
			options.process='Admin Data';
			options.subProcess='Start';
			thisController.adminData(options);
		}
		else {
			Ext.getBody().unmask();
			if (options.error) {
				this.initializationError = new synchronicity.views.AlertPop({html: options.error,
																			invoke: function(val) {}
																			});
				this.initializationError.show();
			}
			else {
				var store = Ext.getStore('synchronicity.stores.settings');
				var first = store.first();
				if (first) {
					first.set('initializedOn',options.initDate);
					first.set('lastSynchronizedOn',options.initDate);
				}
				store.sync();
				var callback = options.callback;   
				if (typeof callback == 'function') {
		            callback.call(options.scope);
		        }
			}
		}
		
	},
	
	
	signon: function(options){
		var thisController = this;
		Ext.Ajax.request({
			url: synchronicity.app.properties.loginUrl,
			timeout: "120000",
			method: "POST",
			params: {                    
				j_username: synchronicity.app.properties.userId,
				j_password: synchronicity.app.properties.password
			},
			success: function (response, opts){
			},
			failure: function(response, opts) {
			}
		});
		Ext.Ajax.request({
			url: synchronicity.app.properties.baseUrl,
			timeout: "120000",
			success: function (response, opts){
				options.process='Signon';
				options.subProcess='Complete';
				thisController.initialize(options);
			},
			failure: function(response, opts){
				Ext.Ajax.request({
					url: synchronicity.app.properties.loginUrl,
					timeout: "120000",
					method: "POST",
					params: {                    
						j_username: synchronicity.app.properties.userId,
						j_password: synchronicity.app.properties.password
					},
					success: function (response, opts){
						options.process='Signon';
						options.subProcess='Complete';
						thisController.initialize(options);
					},
					failure: function(response, opts) {
						options.process='Terminate';
						options.error='Error authenticating. Please provide a valid Username/Password.';
						thisController.initialize(options);
					}
				});
			}
		});
	},
	
	
	accounts: function(options){
		var thisController = this;
		if ((options.subProcess) && options.subProcess=='Start') {
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?request={"config":{"name":"MyAccounts","object":{"name":"Account","components":[{"name":"Account","components":[{"name":"Account Contact","fields":[{"name":"contactId"}]}]}]}}}&pageSize=100&method=open',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						if ((results.response.stateId)) {
							options.subProcess='GetPage';
							options.stateId=results.response.stateId;
							thisController.accounts(options);
						}
						else {
							options.process='Terminate';
							options.error='Error getting account information. No stateId returned. Contact Siebel support team.';
							thisController.initialize(options);
						}
					}
					else {
						options.process='Terminate';
						options.error='Error getting account information. '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting account information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
			});
		}
		else if ((options.subProcess) && (options.subProcess=='Complete' || options.subProcess=='Terminate')) {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=close&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
					},
					failure: function(response, opts){
					}
				});
			}
			thisController.initialize(options);
		}
		else {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=getPage&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var store = Ext.getStore('synchronicity.stores.persistentAccounts');
							var thisProxy = store.getProxy();
							if (results.response.object.components) {
			        			var rows = results.response.object.components;
			        			for (var i = 0; (i < rows.length); i++) {
			        				var account = new thisProxy.model({});
			        				var fields = rows[i].fields;
			        				for (var j = 0; j < fields.length; j++) {
			        					account.data[fields[j].name] = fields[j].value;
			        				}
			        				var contactIds=[];
			        				var components = rows[i].components;
			        				if (components != null){
			        					for (var j = 0; j < components.length; j++) {
				        					if (components[j].name == 'Account Contact') {
				        						var fields = components[j].fields;
				        						for (var k = 0; k < fields.length; k++) {
						        					if (fields[k].name == 'contactId') {
						        						contactIds.push(fields[k].value);
						        					}
						        				}
				        					}
				        				}
			        				}
			        				account.data['contactIds'] = contactIds.toString();
			        				store.add(account);      
			        			}
			    				store.sync();
			        		}
							if (!results.response.object.components || results.response.object.components.length < 100){
								options.subProcess='Complete';
								thisController.accounts(options);
							}
							else {
								thisController.accounts(options);
							}
						}
						else {
							options.process='Terminate';
							options.error='Error getting account information. '+results.response.error;
							thisController.accounts(options);
						}
					},
					failure: function(results, opts){
						options.process='Terminate';
						options.error='Error getting account information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
						thisController.accounts(options);
					}
				});
			}
			else {
				options.process='Terminate';
				options.error='Error getting account information. No stateId provided to get next page of data. Contact Siebel support team.';
				thisController.accounts(options);
			}
		}		
	},
	
	
	
	contacts: function(options){
		var thisController = this;
		if ((options.subProcess) && options.subProcess=='Start') {
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?request={"config":{"name":"MyContacts","object":{"name":"Contact","components":[{"name":"Contact"}]}}}&pageSize=100&method=open',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						if ((results.response.stateId)) {
							options.subProcess='GetPage';
							options.stateId=results.response.stateId;
							thisController.contacts(options);
						}
						else {
							options.process='Terminate';
							options.error='Error getting contact information. No stateId returned. Contact Siebel support team.';
							thisController.initialize(options);
						}
					}
					else {
						options.process='Terminate';
						options.error='Error getting contact information. '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting contact information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
			});
		}
		else if ((options.subProcess) && (options.subProcess=='Complete' || options.subProcess=='Terminate')) {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=close&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
					},
					failure: function(response, opts){
					}
				});
			}
			thisController.initialize(options);
		}
		else {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=getPage&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var store = Ext.getStore('synchronicity.stores.persistentContacts');
							var thisProxy = store.getProxy();
							if (results.response.object.components) {
			        			var rows = results.response.object.components;
			        			for (var i = 0; (i < rows.length); i++) {
			        				var contact = new thisProxy.model({});
			        				var fields = rows[i].fields;
			        				for (var j = 0; j < fields.length; j++) {
			        					contact.data[fields[j].name] = fields[j].value;
			        				}
			        				store.add(contact);      
			        			}
			    				store.sync();
			        		}
							if (!results.response.object.components || results.response.object.components.length < 20){
								options.subProcess='Complete';
								thisController.contacts(options);
							}
							else {
								thisController.contacts(options);
							}
						}
						else {
							options.process='Terminate';
							options.error='Error getting contact information. '+results.response.error;
							thisController.contacts(options);
						}
					},
					failure: function(results, opts){
						options.process='Terminate';
						options.error='Error getting contact information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
						thisController.contacts(options);
					}
				});
			}
			else {
				options.process='Terminate';
				options.error='Error getting contact information. No stateId provided to get next page of data. Contact Siebel support team.';
				thisController.contacts(options);
			}
		}		
	},
	
	
	
	opportunities: function(options){
		var thisController = this;
		if ((options.subProcess) && options.subProcess=='Start') {
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?request={"config":{"name":"MyOpportunities","object":{"name":"Opportunity","components":[{"name":"Opportunity","components":[{"name":"Revenue"},{"name":"Contact","fields":[{"name":"guid"}]}]}]}}}&pageSize=50&method=open',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						if ((results.response.stateId)) {
							options.subProcess='GetPage';
							options.stateId=results.response.stateId;
							thisController.opportunities(options);
						}
						else {
							options.process='Terminate';
							options.error='Error getting opportunity information. No stateId returned. Contact Siebel support team.';
							thisController.initialize(options);
						}
					}
					else {
						options.process='Terminate';
						options.error='Error getting opportunity information. '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting opportunity information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
			});
		}
		else if ((options.subProcess) && (options.subProcess=='Complete' || options.subProcess=='Terminate')) {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=close&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
					},
					failure: function(response, opts){
					}
				});
			}
			thisController.initialize(options);
		}
		else {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=getPage&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var store = Ext.getStore('synchronicity.stores.persistentOpportunities');
							var revenueStore = Ext.getStore('synchronicity.stores.persistentRevenues');
							var thisProxy = store.getProxy();
							var revenueProxy = revenueStore.getProxy();
							if (results.response.object.components) {
			        			var rows = results.response.object.components;
			        			for (var i = 0; (i < rows.length); i++) {
			        				var opportunity = new thisProxy.model({});
			        				var fields = rows[i].fields;
			        				for (var j = 0; j < fields.length; j++) {
			        					opportunity.data[fields[j].name] = fields[j].value;
			        				}
			        				var contactIds=[];
			        				var components = rows[i].components;
			        				if (components != null){
			        					for (var j = 0; j < components.length; j++) {
				        					if (components[j].name == 'Contact') {
				        						var fields = components[j].fields;
				        						for (var k = 0; k < fields.length; k++) {
						        					if (fields[k].name == 'guid') {
						        						contactIds.push(fields[k].value);
						        					}
						        				}
				        					}
				        					if (components[j].name == 'Revenue') {
				        						var revenue = new revenueProxy.model({});
				        						var fields = components[j].fields;
				        						for (var k = 0; k < fields.length; k++) {
				        							revenue.data[fields[k].name] = fields[k].value;
				        						}
				        						revenue.data['opportunityGuid'] = opportunity.data['guid'];
				        						revenueStore.add(revenue);
				        					}
				        				}
			        				}
			        				opportunity.data['contactIds'] = contactIds.toString();
			        				store.add(opportunity);      
			        			}
			    				store.sync();
			    				revenueStore.sync();
			        		}
							if (!results.response.object.components || results.response.object.components.length < 50){
								options.subProcess='Complete';
								thisController.opportunities(options);
							}
							else {
								thisController.opportunities(options);
							}
						}
						else {
							options.process='Terminate';
							options.error='Error getting opportunity information. '+results.response.error;
							thisController.opportunities(options);
						}
					},
					failure: function(results, opts){
						options.process='Terminate';
						options.error='Error getting opportunity information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
						thisController.opportunities(options);
					}
				});
			}
			else {
				options.process='Terminate';
				options.error='Error getting opportunity information. No stateId provided to get next page of data. Contact Siebel support team.';
				thisController.opportunities(options);
			}
		}		
	},	
	
	
	activities: function(options){
		var thisController = this;
		if ((options.subProcess) && options.subProcess=='Start') {
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?request={"config":{"name":"MyActivities","object":{"name":"Action","components":[{"name":"Action","components":[{"name":"Contact","fields":[{"name":"guid"}]}]}]}}}&pageSize=100&method=open',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						if ((results.response.stateId)) {
							options.subProcess='GetPage';
							options.stateId=results.response.stateId;
							thisController.activities(options);
						}
						else {
							options.process='Terminate';
							options.error='Error getting activity information. No stateId returned. Contact Siebel support team.';
							thisController.initialize(options);
						}
					}
					else {
						options.process='Terminate';
						options.error='Error getting activity information. '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting activity information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
			});
		}
		else if ((options.subProcess) && (options.subProcess=='Complete' || options.subProcess=='Terminate')) {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=close&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
					},
					failure: function(response, opts){
					}
				});
			}
			thisController.initialize(options);
		}
		else {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=getPage&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var store = Ext.getStore('synchronicity.stores.persistentActivities');
							var thisProxy = store.getProxy();
							if (results.response.object.components) {
			        			var rows = results.response.object.components;
			        			for (var i = 0; (i < rows.length); i++) {
			        				var activity = new thisProxy.model({});
			        				var fields = rows[i].fields;
			        				for (var j = 0; j < fields.length; j++) {
			        					activity.data[fields[j].name] = fields[j].value;
			        				}
			        				var contactIds=[];
			        				var components = rows[i].components;
			        				if (components != null){
			        					for (var j = 0; j < components.length; j++) {
				        					if (components[j].name == 'Contact') {
				        						var fields = components[j].fields;
				        						for (var k = 0; k < fields.length; k++) {
						        					if (fields[k].name == 'guid') {
						        						contactIds.push(fields[k].value);
						        					}
						        				}
				        					}
				        				}
			        				}
			        				activity.data['contactIds'] = contactIds.toString();
			        				store.add(activity);      
			        			}
			    				store.sync();
			        		}
							if (!results.response.object.components || results.response.object.components.length < 100){
								options.subProcess='Complete';
								thisController.activities(options);
							}
							else {
								thisController.activities(options);
							}
						}
						else {
							options.process='Terminate';
							options.error='Error getting activity information. '+results.response.error;
							thisController.activities(options);
						}
					},
					failure: function(results, opts){
						options.process='Terminate';
						options.error='Error getting activity information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
						thisController.activities(options);
					}
				});
			}
			else {
				options.process='Terminate';
				options.error='Error getting activity information. No stateId provided to get next page of data. Contact Siebel support team.';
				thisController.activities(options);
			}
		}		
	},
	
	
	products: function(options){
		var thisController = this;
		if ((options.subProcess) && options.subProcess=='Start') {
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?request={"config":{"name":"MyProducts","object":{"name":"Product","components":[{"name":"Product"}]}}}&pageSize=100&method=open',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						if ((results.response.stateId)) {
							options.subProcess='GetPage';
							options.stateId=results.response.stateId;
							thisController.products(options);
						}
						else {
							options.process='Terminate';
							options.error='Error getting product information. No stateId returned. Contact Siebel support team.';
							thisController.initialize(options);
						}
					}
					else {
						options.process='Terminate';
						options.error='Error getting product information. '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting product information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
			});
		}
		else if ((options.subProcess) && (options.subProcess=='Complete' || options.subProcess=='Terminate')) {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=close&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
					},
					failure: function(response, opts){
					}
				});
			}
			thisController.initialize(options);
		}
		else {
			if (options.stateId) {
				Ext.Ajax.request({
					url: synchronicity.app.properties.baseSiebelDataUrl+'queryByPage.json?method=getPage&stateId='+options.stateId,
					timeout: "120000",
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var store = Ext.getStore('synchronicity.stores.persistentProducts');
							var thisProxy = store.getProxy();
							if (results.response.object.components) {
			        			var rows = results.response.object.components;
			        			for (var i = 0; (i < rows.length); i++) {
			        				var product = new thisProxy.model({});
			        				var fields = rows[i].fields;
			        				for (var j = 0; j < fields.length; j++) {
			        					product.data[fields[j].name] = fields[j].value;
			        				}
			        				store.add(product);      
			        			}
			    				store.sync();
			        		}
							if (!results.response.object.components || results.response.object.components.length < 100){
								options.subProcess='Complete';
								thisController.products(options);
							}
							else {
								thisController.products(options);
							}
						}
						else {
							options.process='Terminate';
							options.error='Error getting product information. '+results.response.error;
							thisController.products(options);
						}
					},
					failure: function(results, opts){
						options.process='Terminate';
						options.error='Error getting product information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
						thisController.products(options);
					}
				});
			}
			else {
				options.process='Terminate';
				options.error='Error getting product information. No stateId provided to get next page of data. Contact Siebel support team.';
				thisController.products(options);
			}
		}		
	},
	
	
	adminData: function(options){
		var thisController = this;
		thisController.getContactDepartments(options);
	},	
	
	
	getContactDepartments: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"BAX_CONTACT_DEPT"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var divisions = values[j].components;
		        						if (divisions && divisions.length == 1) {
		        							var lov = new thisProxy.model({});
		        							var fields = values[j].fields;
		        							lov.data['type']='BAX_CONTACT_DEPT';
					        				for (var k = 0; k < fields.length; k++) {
					        					lov.data[fields[k].name] = fields[k].value;
					        				}
					        				store.add(lov);      
					        			}
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getContactTitles(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Contact Departments). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Contact Departments). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getContactTitles: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"BAX_CONTACT_JOB_TITLE"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var divisions = values[j].components;
		        						if (divisions && divisions.length == 1) {
		        							var lov = new thisProxy.model({});
		        							var fields = values[j].fields;
		        							lov.data['type']='BAX_CONTACT_JOB_TITLE';
					        				for (var k = 0; k < fields.length; k++) {
					        					lov.data[fields[k].name] = fields[k].value;
					        				}
					        				store.add(lov);      
					        			}
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getActivityType(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Contact Titles). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Contact Titles). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getActivityType: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"TODO_TYPE"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var divisions = values[j].components;
		        						if (divisions && divisions.length == 1) {
		        							var lov = new thisProxy.model({});
		        							var fields = values[j].fields;
		        							lov.data['type']='TODO_TYPE';
					        				for (var k = 0; k < fields.length; k++) {
					        					lov.data[fields[k].name] = fields[k].value;
					        				}
					        				store.add(lov);      
					        			}
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getActivityStatus(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Activity Types). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Activity Types). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getActivityStatus: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"EVENT_STATUS"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var divisions = values[j].components;
		        						if (divisions && divisions.length == 1) {
		        							var lov = new thisProxy.model({});
		        							var fields = values[j].fields;
		        							lov.data['type']='EVENT_STATUS';
					        				for (var k = 0; k < fields.length; k++) {
					        					lov.data[fields[k].name] = fields[k].value;
					        				}
					        				store.add(lov);      
					        			}
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getStates(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Activity Statuses). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Acivity Statuses). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getStates: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"STATE_ABBREV"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var lov = new thisProxy.model({});
		        						var fields = values[j].fields;
	        							lov.data['type']='STATE_ABBREV';
				        				for (var k = 0; k < fields.length; k++) {
				        					lov.data[fields[k].name] = fields[k].value;
				        				}
				        				store.add(lov);      
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getProbability(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (States). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (States). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getProbability: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"PROB"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var lov = new thisProxy.model({});
	        							var fields = values[j].fields;
	        							lov.data['type']='PROB';
				        				for (var k = 0; k < fields.length; k++) {
				        					lov.data[fields[k].name] = fields[k].value;
				        				}
				        				store.add(lov);  
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getReasonWonLost(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Probability). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Probability). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getReasonWonLost: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"REASON_WON_LOST"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var lov = new thisProxy.model({});
	        							var fields = values[j].fields;
	        							lov.data['type']='REASON_WON_LOST';
				        				for (var k = 0; k < fields.length; k++) {
				        					lov.data[fields[k].name] = fields[k].value;
				        				}
				        				store.add(lov);    
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getSalesMethods(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Reason Won Lost). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Reason Won Lost). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getSalesMethods: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"SalesMethods","object":{"name":"SalesMethods"}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var methods = results.response.object.components;
		        			for (var i = 0; (i < methods.length); i++) {
		        				var lov = new thisProxy.model({});
		        				var methodFields = methods[i].fields;
		        				for (var j=0; j<methodFields.length;j++){
		        					lov.data['type']='SALES_METHOD';
		        					if (methodFields[j].name == 'name'){
		        						lov.data['name'] = methodFields[j].value;
		        						lov.data['value'] = methodFields[j].value;
		        					}
		        					if (methodFields[j].name == 'guid'){
		        						lov.data['guid'] = methodFields[j].guid;
		        					}
		        				}
		        				store.add(lov);
		        				var stages = methods[i].components;
		        				if (stages) {
		        					for (var j = 0; (j < stages.length); j++) {
		        						var name="";
		        						var guid="";
		        						var status="";
		        						var orderBy="";
		        						var prob="";
		        						var salesMethodId="";
		        						var salesMethodName="";
		        						var fields = stages[j].fields;
		        						var lov = new thisProxy.model({});
	        							lov.data['type']='SALES_STAGE';
				        				for (var k = 0; k < fields.length; k++) {
				        					if (fields[k].name == 'guid'){
				        						guid = fields[k].value;
				        					}
				        					if (fields[k].name == 'name'){
				        						name = fields[k].value;
				        					}
				        					if (fields[k].name == 'status'){
				        						status = fields[k].value;
				        					}
				        					if (fields[k].name == 'orderBy'){
				        						orderBy = fields[k].value;
				        					}
				        					if (fields[k].name == 'probability'){
				        						prob = fields[k].value;
				        					}
				        					if (fields[k].name == 'salesMethodId'){
				        						salesMethodId = fields[k].value;
				        					}
				        					if (fields[k].name == 'salesMethodName'){
				        						salesMethodName = fields[k].value;
				        					}
				        				}
				        				var names = [name,prob,status];
				        				lov.data['guid']=guid;
				        				lov.data['value']=name;
				        				lov.data['orderBy']=orderBy;
				        				lov.data['name']=names;
				        				lov.data['parentGuid']=salesMethodId;
				        				lov.data['parentName']=salesMethodName;
				        				lov.data['parentValue']=salesMethodName;
				        				store.add(lov);    
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getRevenueTypes(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Sales Methods). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Sales Methods). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getRevenueTypes: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"REVENUE_TYPE"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var divisions = values[j].components;
		        						if (divisions && divisions.length == 1) {
		        							var lov = new thisProxy.model({});
		        							var fields = values[j].fields;
		        							lov.data['type']='REVENUE_TYPE';
					        				for (var k = 0; k < fields.length; k++) {
					        					lov.data[fields[k].name] = fields[k].value;
					        				}
					        				store.add(lov);      
					        			}
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						thisController.getRevenueFrequency(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Activity Statuses). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Acivity Statuses). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	},	
	
	
	getRevenueFrequency: function(options){
		var thisController = this;
		Ext.Ajax.request({
				url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"ListOfValues","object":{"name":"ListOfValues","components":[{"name":"ListOfValueTypes","filters":[{"criteria":[{"field":{"name":"type","value":"BAX_OPTY_REV_INTERVAL"}}]}],"components":[{"name":"ListOfValueValues","components":[{"name":"ListOfValueDivisions"}]}]}]}}}',
				timeout: "120000",
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
						var store = Ext.getStore('synchronicity.stores.persistentListOfValues');
						var thisProxy = store.getProxy();
						if (results.response.object.components) {
		        			var types = results.response.object.components;
		        			for (var i = 0; (i < types.length); i++) {
		        				var values = types[i].components;
		        				if (values) {
		        					for (var j = 0; (j < values.length); j++) {
		        						var lov = new thisProxy.model({});
	        							var fields = values[j].fields;
	        							lov.data['type']='BAX_OPTY_REV_INTERVAL';
				        				for (var k = 0; k < fields.length; k++) {
				        					lov.data[fields[k].name] = fields[k].value;
				        				}
				        				store.add(lov); 
		        					}
		        				}  
		        			}
		        			store.sync();
						}
						options.subProcess='Complete';
						thisController.initialize(options);
					}
					else {
						options.process='Terminate';
						options.error='Error getting admin data (Activity Statuses). '+results.response.error;
						thisController.initialize(options);
					}
				},
				failure: function(response, opts){
					options.process='Terminate';
					options.error='Error getting admin data (Acivity Statuses). Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.';
					thisController.initialize(options);
				}
		});
	}
});