synchronicity.controllers.activity = new Ext.Controller({
	
	initializeActivityList: function(options) {
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		var transientStore = Ext.getStore('synchronicity.stores.transientActivities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return true;
		});
		thisController.copyStore(persistentStore, transientStore, 20);
		transientStore.sync();
	},

	getActivityContacts: function(options){
		var thisController = this;
		var ids = options.contactIds;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
		var transientStore = Ext.getStore('synchronicity.stores.transientActivityContacts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
									function(record, id){
										return ids.indexOf(record.get('guid'))!= -1;
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
					var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
					var transientStore;
					if (options.accountId) {
						transientStore = Ext.getStore('synchronicity.stores.transientAccountActivities');
					}
					else if (options.optyId) {
						transientStore = Ext.getStore('synchronicity.stores.transientOpportunityActivities');
					}
					else if (options.contactId) {
						transientStore = Ext.getStore('synchronicity.stores.transientContactActivities');
					}
					else {
						transientStore = Ext.getStore('synchronicity.stores.transientActivities');
					}
					transientStore.each(function(record) {
						transientStore.remove(record);
			        });
					persistentStore.filterBy(function(record){
												if (((options.accountId==null && options.contactId==null && options.optyId==null)||
													(options.accountId && options.accountId == record.get('accountGuid')) || 
													(options.optyId && options.optyId == record.get('opportunityGuid')) ||
													(options.contactId && record.get('contactIds').indexOf(options.contactId) > -1))&&
													(val==''||
													record.get('type').toUpperCase().indexOf(val.toUpperCase()) > -1 ||
													record.get('subject').toUpperCase().indexOf(val.toUpperCase()) > -1)){
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
	
	showActivityForm: function(options){
		var thisController = this;
		this.list = options.component;
		this.record = options.record;
		this.mode = options.mode;
		this.type = options.type;
		this.accountGuid = options.accountGuid;
		this.opportunityGuid = options.opportunityGuid;
		this.contactGuid = options.contactGuid;
		thisController.getActivityContacts({'contactIds': options.record?options.record.get('contactIds'):options.contactGuid?options.contactGuid:''});
		this.activityForm = new synchronicity.views.ActivityForm({
			listeners: {
                scope: this,
                hide : function() {
                	if (options.mode == 'update'){
                		options.componentSelModel.view.getSelectionModel().deselectAll();
                	}
                }
            }
		});
		if (this.accountGuid || this.opportunityGuid) {
			this.activityForm.accountPickFld.hidden=true;
		}
		var localOffset = new Date().getTimezoneOffset();
		localOffset = localOffset/60;
		var offset = '-'+(new Date(new Date().setHours(localOffset, 0, 0, 0)).toTimeString().substr(0,5).trim());
		if (((options.type) && options.type == 'APPOINTMENT') || ((this.record) && this.record.data.category == 'APPOINTMENT')) {
			this.activityForm.dueDateFld.hidden=true;
			if (!this.type) {
				this.type = this.record.data.category;
			}
			if (options.mode == 'update'){
				var start = new Date(this.record.data.startDate);
				var end = new Date(this.record.data.endDate);
				this.activityForm.startDateFld.setValue(start.format('Y-m-d')+'T'+start.format('H:i:s')+offset);
		    	this.activityForm.endDateFld.setValue(end.format('Y-m-d')+'T'+end.format('H:i:s')+offset);
			}
			else {
				var newDate = new Date();
				var newDate30 = new Date();
				this.activityForm.startDateFld.setValue(newDate.format('Y-m-d')+'T'+newDate.format('H:i:s')+offset);
				newDate30.setMinutes(newDate30.getMinutes()+30);
		    	this.activityForm.endDateFld.setValue(newDate30.format('Y-m-d')+'T'+newDate30.format('H:i:s')+offset);
			}
		}
		else {
			if (!this.type) {
				this.type = this.record.data.category;
			}
			this.activityForm.startDateFld.hidden=true;
			this.activityForm.endDateFld.hidden=true;
			if (options.mode == 'update'){
				var dueOn = new Date(this.record.data.dueOn);
				var start = new Date(this.record.data.startDate);
				var end = new Date(this.record.data.endDate);
				this.activityForm.dueDateFld.setValue(dueOn.format('Y-m-d')+'T'+dueOn.format('H:i:s')+offset);
				this.activityForm.startDateFld.setValue(start.format('Y-m-d')+'T'+start.format('H:i:s')+offset);
		    	this.activityForm.endDateFld.setValue(end.format('Y-m-d')+'T'+end.format('H:i:s')+offset);
			}
			else {
				var newDate = new Date();
				this.activityForm.dueDateFld.setValue(newDate.format('Y-m-d')+'T'+newDate.format('H:i:s')+offset);
			}
		}
		if (options.mode == 'update'){
			this.activityForm.subjectTxtFld.setValue(this.record.data.subject);
	    	this.activityForm.typePickFld.setValue(this.record.data.type);
	    	this.activityForm.statusPickFld.setValue(this.record.data.status);
	    	this.activityForm.descTxtAreaFld.setValue(this.record.data.description);
	    	this.activityForm.activityId.setValue(this.record.data.id);
	    	this.activityForm.activityGuid.setValue(this.record.data.guid);
	    	this.activityForm.mode.setValue(options.mode);
	    	this.activityForm.accountPickFld.setValue(this.record.data.accountGuid);
	    	this.activityForm.opportunityGuid.setValue(this.record.data.opportunityGuid);
		}
		else {
			this.activityForm.accountPickFld.setValue(options.accountGuid);
	    	this.activityForm.opportunityGuid.setValue(options.opportunityGuid);
		}
		this.activityForm.show('fade');
	},
	
	
	hideActivityForm: function(options){
		this.activityForm.hide();
	},
	
	
	upsertRecord: function(options){
		var thisController = this;
		var transientActivityContacts = Ext.getStore('synchronicity.stores.transientActivityContacts');
		var returnObj;
		if (this.record != null) {
			this.record.set('type', options.newRecord.type);
			this.record.set('subject', options.newRecord.subject);
			this.record.set('startDate', options.newRecord.startDate);
			this.record.set('endDate', options.newRecord.endDate);
			this.record.set('dueOn',options.newRecord.dueOn);
			this.record.set('status', options.newRecord.status);
			this.record.set('description', options.newRecord.description);
			if (this.accountGuid == null){
				this.record.set('accountGuid', options.newRecord.accountGuid);
			}
			if (this.record.get('primaryContactGuid').trim() == '') {
				var affilatedContacts = [];
				var primaryContactName;
				transientActivityContacts.each(function(record) {
					if (affilatedContacts.length==0){
						primaryContactName = record.get('firstName')+' '+ record.get('lastName');
					}
					affilatedContacts.push(record.get('guid'));
		        });
				if (affilatedContacts.length > 0){
					this.record.set('primaryContactGuid',affilatedContacts[0]);
				}
				this.record.set('primaryContact',primaryContactName);
			}
			
			this.record.save();
			this.record.store.sync();
		}
		else {
			var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
			var accountActivities = Ext.getStore('synchronicity.stores.transientAccountActivities');
			var opportunityActivities = Ext.getStore('synchronicity.stores.transientOpportunityActivities');
			var contactActivities = Ext.getStore('synchronicity.stores.transientContactActivities');
			var transientActivities = Ext.getStore('synchronicity.stores.transientActivities');
			var persistentAccountStore = Ext.getStore('synchronicity.stores.persistentAccounts');
			persistentStore.filterBy(function(record){
				return true;
			});
			var persistentProxy = persistentStore.getProxy();
			var persistentActivity = new persistentProxy.model({});
			var nextId = persistentStore.data.length+1;
			var uniqGuid = 'local-'+synchronicity.app.properties.userId+'-'+ nextId;
			persistentActivity.data['type'] = options.newRecord.type;
			persistentActivity.data['subject'] = options.newRecord.subject;
			persistentActivity.data['startDate'] = options.newRecord.startDate;
			persistentActivity.data['endDate'] = options.newRecord.endDate;
			persistentActivity.data['dueOn'] = options.newRecord.dueOn;
			persistentActivity.data['status'] = options.newRecord.status;
			persistentActivity.data['description'] = options.newRecord.description;
			persistentActivity.data['accountGuid'] = options.newRecord.accountGuid;
			persistentActivity.data['opportunityGuid'] = options.newRecord.opportunityGuid;
			persistentActivity.data['guid'] = uniqGuid;
			var affilatedContacts = [];
			var primaryContactName;
			transientActivityContacts.each(function(record) {
				if (affilatedContacts.length==0){
					primaryContactName = record.get('firstName')+' '+ record.get('lastName');
				}
				affilatedContacts.push(record.get('guid'));
	        });
			if (affilatedContacts.length > 0){
				persistentActivity.data['primaryContactGuid'] = affilatedContacts[0];
			}
			persistentActivity.data['contactIds'] = affilatedContacts.toString();
			persistentActivity.data['primaryContact'] = primaryContactName;
			if (thisController.type == 'APPOINTMENT') {
				persistentActivity.data['category'] = thisController.type;
			}
			else {
				persistentActivity.data['category'] = 'TO DO';
			}
			if (options.newRecord.accountGuid != '') {
				persistentAccountStore.filterBy(function(record){
					return record.get('guid').indexOf(options.newRecord.accountGuid)!=-1;
				});
				if (persistentAccountStore.first()){
					persistentActivity.data['accountNumber'] = persistentAccountStore.first().get('number');
					persistentActivity.data['accountName'] = persistentAccountStore.first().get('name');
				}
			}
			returnObj = persistentStore.add(persistentActivity);
			persistentStore.sync();
			if (thisController.accountGuid) {
				accountActivities.add(returnObj);
				accountActivities.sync();
			}				
			if (thisController.opportunityGuid){
				opportunityActivities.add(returnObj);
				opportunityActivities.sync();
			}
			if (thisController.contactGuid) {
				contactActivities.add(returnObj);
				contactActivities.sync();
			}
			transientActivities.add(returnObj);
			transientActivities.sync();
		}
		if (this.record){
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Activity',
	            objectId: this.record.get('id'),
	            operation: 'update'
	        });
		}
		else {
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Activity',
	            objectId: returnObj[0].get('id'),
	            operation: 'insert'
	        });
		}
		thisController.hideActivityForm();
	},
	
	
	processServerUpdate: function(options){
		var callback = options.callback; 
		var url;
		var params;
		var process;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		if (options.record.get('operation') == 'insert' || options.record.get('operation') == 'update') {
			var record = persistentStore.getById(options.record.get('objectId'));			
			if (record) {
				var date = new Date();
				var dateStr = date.format('m/d/Y H:i:s');
				url = synchronicity.app.properties.baseSiebelDataUrl+'upsert.json';
				params = {config: {name: "MyActivities",
								     object: {
								    	 	name: "Action",
								    	 	components: [{name: "Action",
								    	 				  fields: [{name: "type",value: record.get('type')},
								    	 				           {name: "startDate",value: record.get('startDate')==''?dateStr:record.get('startDate')},
								    	 				           {name: "endDate",value: record.get('endDate')},
								    	 				           {name: "dueOn",value: record.get('dueOn')},
								    	 				           {name: "status",value: record.get('status')},
								    	 				           {name: "subject",value: record.get('subject')},
								    	 				           {name: "description",value: record.get('description')},
								    	 				           {name: "opportunityGuid",value: record.get('opportunityGuid')},
								    	 				           {name: "accountGuid",value: record.get('accountGuid')},
								    	 				           {name: "display",value: record.get('category') == 'APPOINTMENT'?'Calendar and Activities':'To Do and Activities'},
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
			var contactPersistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
			var record = persistentStore.getById(options.record.get('objectId'));
			var childRecord = contactPersistentStore.getById(options.record.get('childObjectId'));
			if (record && childRecord) {
				url = synchronicity.app.properties.baseSiebelDataUrl+'upsert.json';
				params = {config: {name: "MyActivities",
								     object: {
								    	 	name: "Action",
								    	 	components: [{name: "Action",
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
			var contactPersistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
			var record = persistentStore.getById(options.record.get('objectId'));
			var childRecord = contactPersistentStore.getById(options.record.get('childObjectId'));
			if (record && childRecord) {
				url = synchronicity.app.properties.baseSiebelDataUrl+'deleteChild.json';
				params = {config: {name: "MyActivities",
								     object: {
								    	 	name: "Action",
								    	 	components: [{name: "Action",
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
						if (results.response.object.components) {
							var rows = results.response.object.components;
							for (var i = 0; (i < rows.length); i++) {
								var fields = rows[i].fields;
								for (var j = 0; j < fields.length; j++) {
									if (fields[j].name == 'guid') {
										record.set('guid',fields[j].value);
									};
									if (fields[j].name == 'startDate') {
										record.set('startDate',fields[j].value);
									};
									if (fields[j].name == 'endDate') {
										record.set('endDate',fields[j].value);
									};
								}    
							}
						}
						
						record.save();
						persistentStore.sync();
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