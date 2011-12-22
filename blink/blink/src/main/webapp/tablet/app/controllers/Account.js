synchronicity.controllers.account = new Ext.Controller({
	
	
	initializeAccountList: function(options) {
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
		var transientStore = Ext.getStore('synchronicity.stores.transientAccounts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return true;
		});
		thisController.copyStore(persistentStore, transientStore, 20);
		transientStore.sync();
	},
	
	
	getAccountActivities: function(options){
		var thisController = this;
		var id = options.accountId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		var transientStore = Ext.getStore('synchronicity.stores.transientAccountActivities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return record.get('accountGuid').indexOf(id) != -1;
		});
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();		
	},
	
	
	getAccountContacts: function(options){
		var thisController = this;
		var ids = options.contactIds;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
		var transientStore = Ext.getStore('synchronicity.stores.transientAccountContacts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
				function(record){
					return ids.indexOf(record.get('guid'))!= -1;
				}
		);
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	
	
	getAccountOpportunities: function(options){
		var thisController = this;
		var id = options.accountId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
		var transientStore = Ext.getStore('synchronicity.stores.transientOpportunities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return record.get('accountGuid').indexOf(id) != -1;
		});
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	

	showSearchBox: function(options){
		var thisController = this;
		this.search = new synchronicity.views.SearchPop({invoke: function(val) {
				Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
				var task = new Ext.util.DelayedTask(function(){
					var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
					var transientStore = Ext.getStore('synchronicity.stores.transientAccounts');
					transientStore.each(function(record) {
						transientStore.remove(record);
			        });
					persistentStore.filterBy(function(record){
												if ((options.contactId==null || options.contactId && record.get('contactIds').indexOf(options.contactId) > -1) &&
													(val==''||
													record.get('number').toUpperCase().indexOf(val.toUpperCase()) != -1 ||
													record.get('name').toUpperCase().indexOf(val.toUpperCase()) != -1)){
												
													return true;
												}
												return false;
											});
					thisController.copyStore(persistentStore, transientStore, 20);
					transientStore.sync();
					Ext.getBody().unmask();	
				});
				task.delay(500);
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
	
	
	showAccountForm: function(options){
		this.list = options.component;
		this.record = options.record;
		var addressTemplate = this.record.data.addressLine1;
		if (this.record.data.addressLine2) {
			addressTemplate = addressTemplate+ ", ";
		}
		addressTemplate = addressTemplate+ this.record.data.addressLine2;
		if (this.record.data.city) {
			addressTemplate = addressTemplate+ ", ";
		}
		addressTemplate = addressTemplate+ this.record.data.city;
		if (this.record.data.state) {
			addressTemplate = addressTemplate+ ", ";
		}
		addressTemplate = addressTemplate+ this.record.data.state+" "+this.record.data.zipcode;
		this.accountForm = new synchronicity.views.AccountForm({
				listeners: {
                    scope: this,
                    hide : function() {
                        options.componentSelModel.view.getSelectionModel().deselectAll();
                    }
                }
			});
		this.accountForm.accountNumberTxtFld.setValue(this.record.data.number);
		this.accountForm.accountNameTxtFld.setValue(this.record.data.name);
		this.accountForm.addressTxtAreaFld.setValue(addressTemplate);
		if (this.record.data.focusAccount=='Y') {
			this.accountForm.markFocusAccount.hidden=true;
		}
		else {
			this.accountForm.markNotFocusAccount.hidden=true;
		}
		this.accountForm.show('fade');
	},
	
	
	hideAccountForm: function(options){
		this.accountForm.hide();
	},
	
	
	updateRecord: function(options){
		this.record.set("focusAccount",options.focusAccount);
		this.record.save();
		this.record.store.sync();
		Ext.dispatch({
            controller: synchronicity.controllers.transaction,
            action: 'insert',
            type: 'Account',
            objectId: this.record.get('id'),
            operation: 'update'
        });
	},
	
	
	processServerUpdate: function(options){
		var callback = options.callback; 
		var url;
		var params;
		var process;
		if (options.record.get('operation') == 'update') {
			var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
			var record = persistentStore.getById(options.record.get('objectId'));			
			if (record) {
				url = synchronicity.app.properties.baseSiebelDataUrl+'update.json';
				params = {config: {name: "MyAccounts",
								     object: {
								    	 	name: "Account",
								    	 	components: [{name: "Account",
								    	 				  fields: [{name: "focusAccount",value: record.get('focusAccount')},
								    	 				           {name: "guid",value: record.get('guid')}
								    	 				  		  ]
								    	 				 }]
								     }
							}
						 };
				process=true;
			}
			else {
				process=false;
			}
		}
		else if (options.record.get('operation') == 'contactAdd'){
			var accountPersistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
			var contactPersistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
			var record = accountPersistentStore.getById(options.record.get('objectId'));
			var childRecord = contactPersistentStore.getById(options.record.get('childObjectId'));
			if (record && childRecord) {
				url = synchronicity.app.properties.baseSiebelDataUrl+'upsert.json';
				params = {config: {name: "MyAccounts",
								     object: {
								    	 	name: "Account",
								    	 	components: [{name: "Account",
								    	 				  fields: [{name: "guid",value: record.get('guid')}
								    	 				  		  ],
								    	 				  components:[{name: "Contact",
								    	 					           fields: [{name: "guid",
								    	 					        	         value: childRecord.get('guid')
								    	 					        	        }]
								    	 				  			   }]	  
								    	 				 }]
								     }
							}
						 };
				process=true;
			}
			else {
				process=false;
			}
		}
		else if (options.record.get('operation') == 'contactRemove'){
			var accountPersistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
			var contactPersistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
			var record = accountPersistentStore.getById(options.record.get('objectId'));
			var childRecord = contactPersistentStore.getById(options.record.get('childObjectId'));
			if (record && childRecord) {
				url = synchronicity.app.properties.baseSiebelDataUrl+'deleteChild.json';
				params = {config: {name: "MyAccounts",
								     object: {
								    	 	name: "Account",
								    	 	components: [{name: "Account",
								    	 				  fields: [{name: "guid",value: record.get('guid')}
								    	 				  		  ],
								    	 				  components:[{name: "Contact",
								    	 					           fields: [{name: "guid",
								    	 					        	         value: childRecord.get('guid')
								    	 					        	        }]
								    	 				  			   }]	  
								    	 				 }]
								     }
							}
						 };
				process=true;
			}
			else {
				process=false;
			}
		}
		if (process) {
			Ext.Ajax.request({
				url: url,
				timeout: "10000",
				method: "POST",
				params: {request: Ext.util.JSON.encode(params)},
				success: function (response, opts){
					var results = Ext.util.JSON.decode(response.responseText);
					if ((results.response.status) && results.response.status == 0) {
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
			if (typeof callback == 'function') {
	            callback.call(options.scope);
	        }
		}
	}
});