synchronicity.controllers.contact = new Ext.Controller({
	
	initializeContactList: function(options) {
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
		var transientStore = Ext.getStore('synchronicity.stores.transientContacts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return true;
		});
		thisController.copyStore(persistentStore, transientStore, 20);
		transientStore.sync();
	},

	
	getContactActivities: function(options){
		var thisController = this;
		var id = options.contactId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		var transientStore = Ext.getStore('synchronicity.stores.transientContactActivities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
									function(record){
										return record.get('contactIds').indexOf(id) != -1;
									}
								);
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();		
	},
	
	
	getContactAccounts: function(options){
		var thisController = this;
		var id = options.contactId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
		var transientStore = Ext.getStore('synchronicity.stores.transientAccounts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
				function(record){
					return record.get('contactIds').indexOf(id) != -1;
				}
		);
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	
	
	getContactOpportunities: function(options){
		var thisController = this;
		var id = options.contactId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
		var transientStore = Ext.getStore('synchronicity.stores.transientOpportunities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
									function(record){
										return record.get('contactIds').indexOf(id) != -1;
									}
								);
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	
	
	showSearchBox: function(options){
		var thisController = this;
		this.search = new synchronicity.views.SearchPop({invoke: function(val) {
				Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
				var task = new Ext.util.DelayedTask(function(){
					var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
					persistentStore.filterBy(function(record, id){
												if (((options.accountId==null && options.activityId==null && options.optyId==null)||
													(options.contactIds && options.contactIds.indexOf(record.get('guid')) > -1))&&
													(val==''||
													record.get('firstName').toUpperCase().indexOf(val.toUpperCase()) == 0 ||
													record.get('lastName').toUpperCase().indexOf(val.toUpperCase()) == 0)){
												
													return true;
												}
												return false;
											});
					var transientStore;
					if (options.accountId){
						var transientStore = Ext.getStore('synchronicity.stores.transientAccountContacts');
					}
					else if (options.optyId) {
						var transientStore = Ext.getStore('synchronicity.stores.transientOpportunityContacts');
					}
					else if (options.activityId) {
						var transientStore = Ext.getStore('synchronicity.stores.transientActivityContacts');
					}
					else {
						var transientStore = Ext.getStore('synchronicity.stores.transientContacts');
					}
					transientStore.each(function(record) {
						transientStore.remove(record);
			        });
					thisController.copyStore(persistentStore, transientStore, 20);
					transientStore.sync();
					Ext.getBody().unmask();	
				});
				task.delay(100);
			}
			});
		this.search.showBy(options.baxObject);
	},
	
	copyStore: function(fromStore,toStore,numRows){
		var i = 0;
		fromStore.each(function(record) {
			i++;
			if (numRows==null || i <= numRows){
				toStore.add(record);
			}
			else {
				return;
			}
        });
	},
	
	showContactForm: function(options){
		this.list = options.component;
		this.record = options.record;
		this.mode = options.mode;
		this.accountId = options.accountId;
		this.accountGuid = options.accountGuid;
		this.opportunityId = options.opportunityId;
		this.opportunityGuid = options.opportunityGuid;
		this.activityId = options.activityId;
		this.activityGuid = options.activityGuid;
		this.contactForm = new synchronicity.views.ContactForm({
			listeners: {
                scope: this,
                hide : function() {
                	if (options.mode == 'update'){
                		options.componentSelModel.view.getSelectionModel().deselectAll();
                	}
                }
            }
		});
		if (options.mode == 'update'){
			this.contactForm.firstNameTxtFld.setValue(this.record.data.firstName);
	    	this.contactForm.lastNameTxtFld.setValue(this.record.data.lastName);
	    	this.contactForm.addressLine1TxtFld.setValue(this.record.data.addressLine1);
	    	this.contactForm.addressLine2TxtFld.setValue(this.record.data.addressLine2);
	    	this.contactForm.cityTxtFld.setValue(this.record.data.city);
	    	this.contactForm.statePickFld.setValue(this.record.data.state);
	    	this.contactForm.postalCodeTxtFld.setValue(this.record.data.zipcode);
	    	this.contactForm.departmentPickFld.setValue(this.record.data.department);
	    	this.contactForm.titlePickFld.setValue(this.record.data.title);
	    	this.contactForm.workPhNumTxtFld.setValue(this.record.data.workPhone);
	    	this.contactForm.cellPhNumTxtFld.setValue(this.record.data.cellPhone);
	    	this.contactForm.emailTxtFld.setValue(this.record.data.email);
		}
		this.contactForm.show('fade');
	},
	
	
	hideContactForm: function(options){
		this.contactForm.hide();
	},
	
	
	affiliateRecord: function(options){
		if (options.contactGuid) {
			if (options.accountGuid && options.accountGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
				var transientStore = Ext.getStore('synchronicity.stores.transientAccountContacts');
				var transientAccountStore = Ext.getStore('synchronicity.stores.transientAccounts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.accountId);
				var contactIds = record.get('contactIds');
				if (contactIds.indexOf(options.contactGuid) == -1) {
					var array = contactIds.split(',');
					array.push(options.contactGuid);
					record.set('contactIds',array.toString());
					record.save();
					persistentStore.sync();
					transientStore.add(contact);
					transientStore.sync();
					var exists = false;
					transientAccountStore.filterBy(function(record){
						if (record.get('id') == options.accountId) {
							exists = true;
						}
						return true;
					});
					if (!exists) {
						transientAccountStore.add(record);
						transientAccountStore.sync();
					}
					Ext.dispatch({
			            controller: synchronicity.controllers.transaction,
			            action: 'insert',
			            type: 'Account',
			            objectId: options.accountId,
			            operation: 'contactAdd',
			            childObjectId: options.contactId,
			            force: true
			        });
				}
			}
			if (options.opportunityGuid && options.opportunityGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
				var transientStore = Ext.getStore('synchronicity.stores.transientOpportunityContacts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.opportunityId);
				var contactIds = record.get('contactIds');
				if (contactIds.indexOf(options.contactGuid) == -1) {
					var array = contactIds.split(',');
					array.push(options.contactGuid);
					record.set('contactIds',array.toString());
					record.save();
					record.store.sync();
					transientStore.add(contact);
					transientStore.sync();
					Ext.dispatch({
			            controller: synchronicity.controllers.transaction,
			            action: 'insert',
			            type: 'Opportunity',
			            objectId: options.opportunityId,
			            operation: 'contactAdd',
			            childObjectId: options.contactId,
			            force: true
			        });
				}
			}
			if (options.activityGuid && options.activityGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
				var transientStore = Ext.getStore('synchronicity.stores.transientActivityContacts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.activityId);
				var contactIds = record.get('contactIds');
				if (contactIds.indexOf(options.contactGuid) == -1) {
					var array = contactIds.split(',');
					array.push(options.contactGuid);
					record.set('contactIds',array.toString());
					record.save();
					record.store.sync();
					transientStore.add(contact);
					transientStore.sync();
					Ext.dispatch({
			            controller: synchronicity.controllers.transaction,
			            action: 'insert',
			            type: 'Activity',
			            objectId: options.activityId,
			            operation: 'contactAdd',
			            childObjectId: options.contactId,
			            force: true
			        });
				}
			}
		}
	},
	
	
	unAffiliateRecord: function(options){
		if (options.contactGuid) {
			if (options.accountGuid && options.accountGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
				var transientStore = Ext.getStore('synchronicity.stores.transientAccountContacts');
				var transientAccountStore = Ext.getStore('synchronicity.stores.transientAccounts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.accountId);
				var contactIds = record.get('contactIds');
				var array = contactIds.split(',');
				var newArray = [];
				for (var i=0;i<array.length;i++){
					if (array[i] != options.contactGuid) {
						newArray.push(array[i]);
					}
					else {
						Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'insert',
				            type: 'Account',
				            objectId: options.accountId,
				            operation: 'contactRemove',
				            childObjectId: options.contactId,
				            force: true
				        });
					}
				}
				record.set('contactIds',newArray.toString());
				record.save();
				record.store.sync();
				transientStore.remove(contact);
				transientStore.sync();
				if (options.currentView == 'synchronicity.views.contactAccount') {
					transientAccountStore.remove(record);
					transientAccountStore.sync();		
				}
			}
			if (options.opportunityGuid && options.opportunityGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
				var transientStore = Ext.getStore('synchronicity.stores.transientOpportunityContacts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.opportunityId);
				var contactIds = record.get('contactIds');
				var array = contactIds.split(',');
				var newArray = [];
				for (var i=0;i<array.length;i++){
					if (array[i] != options.contactGuid) {
						newArray.push(array[i]);
					}
					else {
						Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'insert',
				            type: 'Opportunity',
				            objectId: options.opportunityId,
				            operation: 'contactRemove',
				            childObjectId: options.contactId,
				            force: true
				        });
					}
				}
				record.set('contactIds',newArray.toString());
				record.save();
				record.store.sync();
				transientStore.remove(contact);
				transientStore.sync();
			}
			if (options.activityGuid && options.activityGuid.trim() != '') {
				var persistentContactStore = Ext.getStore('synchronicity.stores.persistentContacts');
				var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
				var transientStore = Ext.getStore('synchronicity.stores.transientActivityContacts');
				var contact = persistentContactStore.getById(options.contactId);
				var record = persistentStore.getById(options.activityId);
				var contactIds = record.get('contactIds');
				var array = contactIds.split(',');
				var newArray = [];
				for (var i=0;i<array.length;i++){
					if (array[i] != options.contactGuid) {
						newArray.push(array[i]);
					}
					else {
						Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'insert',
				            type: 'Activity',
				            objectId: options.activityId,
				            operation: 'contactRemove',
				            childObjectId: options.contactId,
				            force: true
				        });
					}
				}
				record.set('contactIds',newArray.toString());
				record.save();
				record.store.sync();
				transientStore.remove(contact);
				transientStore.sync();
			}
		}
	},
	
	
	upsertRecord: function(options){
		var thisController = this;
		var returnObj;
		if (this.record != null) {
			this.record.set('firstName', options.newRecord.firstName);
			this.record.set('lastName', options.newRecord.lastName);
			this.record.set('department', options.newRecord.department);
			this.record.set('title', options.newRecord.title);
			this.record.set('workPhone',options.newRecord.workPhone);
			this.record.set('cellPhone', options.newRecord.cellPhone);
			this.record.set('email', options.newRecord.email);
			this.record.set('addressLine1', options.newRecord.addressLine1);
			this.record.set('addressLine2', options.newRecord.addressLine2);
			this.record.set('city', options.newRecord.city);
			this.record.set('state', options.newRecord.state);
			this.record.set('zipcode', options.newRecord.zipcode);
			this.record.save();
			this.record.store.sync();
		}
		else {
			var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
			var transientStore = Ext.getStore('synchronicity.stores.transientContacts');
			persistentStore.filterBy(function(record, id){
				return true;
			});
			var persistentProxy = persistentStore.getProxy();
			var persistentContact = new persistentProxy.model({});
			var nextId = persistentStore.data.length+1;
			var uniqGuid = 'local-'+synchronicity.app.properties.userId+'-'+ nextId;
			persistentContact.data['firstName'] = options.newRecord.firstName;
			persistentContact.data['lastName'] = options.newRecord.lastName;
			persistentContact.data['department'] = options.newRecord.department;
			persistentContact.data['title'] = options.newRecord.title;
			persistentContact.data['workPhone'] = options.newRecord.workPhone;
			persistentContact.data['cellPhone'] = options.newRecord.cellPhone;
			persistentContact.data['email'] = options.newRecord.email;
			persistentContact.data['addressLine1'] = options.newRecord.addressLine1;
			persistentContact.data['addressLine2'] = options.newRecord.addressLine2;
			persistentContact.data['city'] = options.newRecord.city;
			persistentContact.data['state'] = options.newRecord.state;
			persistentContact.data['zipcode'] = options.newRecord.zipcode;
			persistentContact.data['status'] = 'Active';
			persistentContact.data['guid'] = uniqGuid;
			var returnObj = persistentStore.add(persistentContact);
			persistentStore.sync();
			var record = persistentStore.getById(returnObj[0].data.id);
			transientStore.add(record);
			transientStore.sync();
		}
		if (this.record){
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Contact',
	            objectId: this.record.get('id'),
	            operation: 'update'
	        });
		}
		else {
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Contact',
	            objectId: returnObj[0].get('id'),
	            operation: 'insert'
	        });
		}
		thisController.affiliateRecord({'accountId':this.accountId, 'accountGuid':this.accountGuid, 
										'opportunityId': this.opportunityId, 'opportunityGuid': this.opportunityGuid, 
										'activityId': this.activityId,'activityGuid': this.activityGuid,
										'contactId': this.record?this.record.get('id'): returnObj[0].get('id'),
										'contactGuid': this.record?this.record.get('guid'): returnObj[0].get('guid'),
										record: this.record?this.record: returnObj[0]
									   });
		thisController.hideContactForm();
	},
	
	
	processServerUpdate: function(options){
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
		var record = persistentStore.getById(options.record.get('objectId'));	
		var url;
		var params;
		var process;
		if (record) {
			if (options.record.get('operation') == 'insert') {
				url = synchronicity.app.properties.baseSiebelDataUrl+'insert.json';
				params = {config: {name: "MyContacts", object: {name: "Contact",components: [{name: "Contact",
							    	 				  fields: [{name: "firstName",value: record.get('firstName')},
							    	 				           {name: "lastName",value: record.get('lastName')},
							    	 				           {name: "workPhone",value: record.get('workPhone')},
							    	 				           {name: "cellPhone",value: record.get('cellPhone')},
							    	 				           {name: "email",value: record.get('email')},
							    	 				           {name: "guid",value: record.get('guid')}
							    	 				  		  ],
							    	 				  components:[{name: "Departments Titles",
					    	 					           fields: [{name: "department", value: record.get('department')},
					    	 					                    {name: "title", value: record.get('title')}
					    	 					           		   ]
					    	 				  			   }]	
							    	 				 }]
							     }
						}
					 };
				Ext.Ajax.request({url: url,timeout: "10000",method: "POST",params: {request: Ext.util.JSON.encode(params)},
					success: function (response, opts){
						var results = Ext.util.JSON.decode(response.responseText);
						if ((results.response.status) && results.response.status == 0) {
							var guid;
							if (results.response.object.components) {
								var rows = results.response.object.components;
								for (var i = 0; (i < rows.length); i++) {
									var fields = rows[i].fields;
									for (var j = 0; j < fields.length; j++) {
										if (fields[j].name == 'guid') {
											guid = fields[j].value;
										};
									}    
								}
							}
							thisController.changeLocalOpportunityContact({oldGuid: record.get('guid'), newGuid: guid});
							thisController.changeLocalActivityContact({oldGuid: record.get('guid'), newGuid: guid});
							record.set('guid',guid);
							record.save();
							persistentStore.sync();
							thisController.processServerAddressUpdate({guid: guid, record: record});
							var callback = options.callback;        
					        if (typeof callback == 'function') {
					            callback.call(options.scope);
					        }
						}
						else {
							console.log(results.response.error);
						}
					},
					failure: function(response, opts) {
						console.log(response);
					}
				});
			}
			else {
				thisController.processServerAddressUpdate({guid: record.get('guid'), record: record});
				var callback = options.callback;        
		        if (typeof callback == 'function') {
		            callback.call(options.scope);
		        }
			}
		}
	},
	
	
	processServerAddressUpdate: function(options) {
		if (options.guid && options.record.get('addressLine1').length != 0) {
			var url = synchronicity.app.properties.baseSiebelDataUrl+'upsert.json';
			var params = {config: {name: "MyContacts",object: {name: "Contact",components: [{name: "Contact",
			    	 				  fields: [{name: "guid",value: options.guid}],
			    	 				  components:[{name: "Address",
	    	 					           fields: [{name: "addressLine1", value: options.record.get('addressLine1')},
	    	 					                    {name: "addressLine2", value: options.record.get('addressLine2')},
	    	 					                    {name: "city", value: options.record.get('city')},
	    	 					                    {name: "state", value: options.record.get('state')},
	    	 					                    {name: "zipcode", value: options.record.get('zipcode')},
	    	 					                    {name: "nameLock", value: 'Y'},
	    	 					                    {name: "name", value: options.guid}
	    	 					           		   ]
	    	 				  			   }]	
			    	 				 }]
			     }
				}
			};
			Ext.Ajax.request({url: url,timeout: "10000",method: "POST",params: {request: Ext.util.JSON.encode(params)},
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status != 0) {
						console.log(results.response.error);
					}
				},
				failure: function(response, opts) {
					console.log(response);
				}
			});
		}
	},
	
	
	changeLocalOpportunityContact: function (options) {
		console.log('changeLocalOpportunityContact: ');
		console.log(options);
	},
	
	
	changeLocalActivityContact: function (options) {
		console.log('changeLocalActivityContact: ');
		console.log(options);
	}
});