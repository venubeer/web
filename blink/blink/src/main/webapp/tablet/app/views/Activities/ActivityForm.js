synchronicity.views.ActivityForm = Ext.extend(Ext.Panel, {
	floating: true,
    modal: true,
    centered: true,
    scroll: 'vertical',
    hideOnMaskTap: false,
    width: 450,
    height: 550,
    dockedItems: [],

    items: [],
    
    initComponent: function() {
    	var thisForm = this;
    	var picklistStore = Ext.getStore('synchronicity.stores.persistentListOfValues');
    	var typeStore = [{text:"",value:""}];
		var statusStore = [{text:"",value:""}];
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'TODO_TYPE', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {typeStore[typeStore.length] = {text: record.get('value'), value: record.get('name')};});
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'EVENT_STATUS', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {statusStore[statusStore.length] = {text: record.get('value'), value: record.get('name')};});
		var accountStore = Ext.getStore('synchronicity.stores.persistentAccounts');
		accountStore.filterBy(function(record){
			return true;
		});
		
    	this.subjectTxtFld = new Ext.form.Text({label: 'Subject',required: true, maxLength: 100});
    	this.typePickFld = new Ext.form.Select({label: 'Type', required: true, options: typeStore});
    	this.startDateFld = new Ext.ux.form.DateTimePicker({label: 'Start', required: true});
    	this.endDateFld = new Ext.ux.form.DateTimePicker({label: 'End', required: true});
    	this.dueDateFld = new Ext.ux.form.DateTimePicker({label: 'Due on', required: true});
    	this.statusPickFld = new Ext.form.Select({label: 'Status', options: statusStore});
    	this.descTxtAreaFld = new Ext.form.TextArea({label: 'Description', maxLength: 1000});
    	this.accountPickFld = new Ext.form.Select({label: 'Account', displayField: 'accountNumName', valueField: 'guid', store: accountStore});
    	this.activityId = new Ext.form.TextArea();
    	this.activityGuid = new Ext.form.TextArea();
    	this.mode = new Ext.form.TextArea();
    	this.opportunityGuid = new Ext.form.TextArea();
    	
    	
    	var affiliatedContactStore = Ext.getStore('synchronicity.stores.transientActivityContacts');
    	var affiliatedContactStoreSize = affiliatedContactStore.data.length;
    	this.addContactsBtn = new Ext.Button({text: 'Add Contacts ('+affiliatedContactStoreSize+')',
									    	  handler: this.showContactList,
									          scope: this
									         }
    									    );
    	
    	this.affiliatedContacts = new Ext.List({
    									scroll: false,
    									store: synchronicity.stores.transientActivityContacts,
    								    ui: 'round',
    								    singleSelect: true,
				                		emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No contacts found...</div>',
				                		itemTpl : new Ext.XTemplate(
									 		'<div class="list-item-title"> ',
									 		'<span class="delete-item-hidden x-button x-button-decline">',
									 		'<span class="x-button-label">Remove</span>',
									 		'</span>',
									 		'{lastName},&nbsp;{firstName}&nbsp;({department}/{title})</div>',
							 				'<div class="list-item-narrative">{workPhone}</div>'),
							 			listeners:{
										     itemtap: function(list,index,item,e){
										    	 if (e.getTarget('.delete-item-delete')) {
										    		 if (thisForm.mode.getValue() == 'update') {
											    		 Ext.dispatch({
								 	                         controller: synchronicity.controllers.contact,
								 	                         action: 'unAffiliateRecord',
								 	                         contactId: list.getStore().getAt(index).get('id'),
								 	                         contactGuid: list.getStore().getAt(index).get('guid'),
								 	                         activityId: thisForm.activityId.getValue(),
								 	                         activityGuid: thisForm.activityGuid.getValue()
								 	                     });
										    		 }
											    	 else {
											    		 var transientActivityContacts = Ext.getStore('synchronicity.stores.transientActivityContacts');
											    		 transientActivityContacts.remove(list.getStore().getAt(index));
											    		 transientActivityContacts.sync();
											    	 }
										    		 thisForm.addContactsBtn.setText('Add Contacts ('+list.store.data.length+')');
										    	 }
										    	 else {
										    		 var e1 = Ext.select('span.delete-item-delete', this.contactList);								    		 
										    		 e1.removeCls('delete-item-delete');
										    		 new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(10);
										    	 }
								             },
							 			     itemSwipe: function(list,index,item,e){
							 			    	Ext.select('span.delete-item-delete',this.affiliatedContacts).removeCls('delete-item-delete');
										    	var e1 = Ext.select('span.delete-item-hidden',item);			    	 
										    	e1.addCls('delete-item-delete');
							 			     }
							 			}
    	});
    	this.items = [{xtype: 'form',
			           items: [{
				                xtype: 'fieldset',
				                items: [this.subjectTxtFld,
						            	this.typePickFld,
						            	this.startDateFld,
						            	this.endDateFld,
						            	this.dueDateFld,
						            	this.statusPickFld,
						            	this.accountPickFld,
						            	this.descTxtAreaFld
						            	]
			            		},
			            		{
			            		xtype: 'fieldset',
				                items: [this.addContactsBtn
						            	]
			            		},
			            		{
			            		xtype: 'fieldset',
			            		title: 'Contacts',
				                items: [this.affiliatedContacts
						            	]
			            		}]
			        }];   
    	this.dockedItems = [{dock: 'top',
					        xtype: 'toolbar',
					        title: 'Activity Form',
					        items: [{xtype: 'button', 
							   		 ui: 'decline',
							         text: 'Cancel',
							         handler: function(cmp) {
							                	 Ext.dispatch({
							                         controller: synchronicity.controllers.activity,
							                         action: 'hideActivityForm'
							                     });
							         		}
							        },
							        {xtype: 'spacer', flex: 1},
					                {xtype: 'button', 
					        		 ui: 'action',
					                 text: 'Done',
					                 handler: function(cmp) {
					                	 		 var validations = true;
					                	 		 thisForm.items.first().items.first().items.each(function(item){
					                	 			 if (!item.hidden && item.required && (item.getValue()== null ||item.getValue().length == 0)){
					                	 				 validations = false;
					                	 			 }
					                	 		 });
					                	 		 if (validations) {
						                	 		 var startDay='';
						                	 		 var endDay='';
						                	 		 var todoDay='';
						                	 		 if (thisForm.startDateFld.getValue() != null && thisForm.startDateFld.getValue() != '' ) {
						                	 			startDay = new Date(thisForm.startDateFld.getValue());
						                	 		 }
						                	 		 if (thisForm.endDateFld.getValue() != null && thisForm.endDateFld.getValue() != '' ) {
						                	 			endDay = new Date(thisForm.endDateFld.getValue());
						                	 		 }
						                	 		 if (thisForm.startDateFld.getValue() != null && thisForm.endDateFld.getValue() !=null 
						                	 				 && thisForm.startDateFld.getValue() != '' 
						                	 				 && thisForm.endDateFld.getValue() != '') {
						                	 			startDay = new Date(thisForm.startDateFld.getValue());
						                	 			endDay = new Date(thisForm.endDateFld.getValue());
						                	 			if (startDay > endDay) {
						                	 				alert ('Start Date should be less than End Date.');
						                	 				validations = false;
						                	 			}
						                	 		 }
						                	 		 if (thisForm.dueDateFld.getValue() != null && thisForm.dueDateFld.getValue() != ''){
						                	 			todoDay = new Date(thisForm.dueDateFld.getValue());
						                	 		 }
						                	 		 if (validations){
									                	 Ext.dispatch({
									                         controller: synchronicity.controllers.activity,
									                         action: 'upsertRecord',
									                         newRecord: {'subject': thisForm.subjectTxtFld.getValue(),
									                        	 		 'type': thisForm.typePickFld.getValue(),
									                        	 		 'startDate':startDay==""?"":startDay.format('m/d/Y H:i:s'),
									                        	 		 'endDate': endDay==""?"":endDay.format('m/d/Y H:i:s'),
									                        	 		 'dueOn': todoDay==""?"":todoDay.format('m/d/Y H:i:s'),
									                        	 		 'status': thisForm.statusPickFld.getValue(),
									                        	 		 'description': thisForm.descTxtAreaFld.getValue(),
									                        	 		 'accountGuid': thisForm.accountPickFld.getValue(),
									                        	 		 'opportunityGuid': thisForm.opportunityGuid.getValue()
									                        	 		}
									                     });
						                	 		 }
					                	 		 }
					                	 		 else {
					                	 			alert('Enter values for all required columns.');
					                	 		 }
					                 		}
					                 }
					              ]
						    }];
    	synchronicity.views.ActivityForm.superclass.initComponent.call(this);
    },
    
    
    showContactList: function() {
    	var thisForm = this;
    	var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
    	var i=0;
    	persistentStore.filterBy(function(record){
    		i++;
			if (i<21){
				return true;
			}
			return false;
		});
		this.list = new Ext.List({
			toolbar: true,
		    itemTpl : new Ext.XTemplate(
			 		'<div class="list-item-title"> ',
			 		'<span class="delete-item-hidden x-button x-button-confirm">',
			 		'<span class="x-button-label">Affiliate</span>',
			 		'</span>',
			 		'{lastName},&nbsp;{firstName}&nbsp;({department}/{title})</div>',
	 				'<div class="list-item-narrative">{workPhone}</div>'),
	    	store: persistentStore,
	    	scroll: false,
	    	listeners:{
				itemtap: function(list,index,item,e){
					 if (e.getTarget('.delete-item-delete')) {
						 if (thisForm.mode.getValue() == 'update') {
							 Ext.dispatch({
	 	                         controller: synchronicity.controllers.contact,
	 	                         action: 'affiliateRecord',
	 	                         contactId: list.getStore().getAt(index).get('id'),
	 	                         contactGuid: list.getStore().getAt(index).get('guid'),
	 	                         activityGuid: thisForm.activityGuid.getValue(),
	 	                         activityId: thisForm.activityId.getValue()
	 	                     });
						 }
						 else {
							 var transientActivityContacts = Ext.getStore('synchronicity.stores.transientActivityContacts');
				    		 transientActivityContacts.add(list.getStore().getAt(index));
				    		 transientActivityContacts.sync();
						 }
						 thisForm.addContactsBtn.setText('Add Contacts ('+thisForm.affiliatedContacts.store.data.length+')');
						 Ext.select('span.delete-item-delete',item).removeCls('delete-item-delete');
			    	 }
			    	 else {
			    		 var e1 = Ext.select('span.delete-item-delete',item);								    		 
			    		 if (e1.getCount()== 0){
			    			 Ext.select('span.delete-item-delete',this.list).removeCls('delete-item-delete');
			    			 Ext.select('span.delete-item-hidden',item).addCls('delete-item-delete');
			    		 }
			    		 else {
			    			 e1.removeCls('delete-item-delete');
			    		 }
			    	 }
	            }
	    	}
		});
		var panel = Ext.extend(Ext.Panel, {
			floating: true, 
			modal: true, 
			centered: true,
			width: 400,
			height: 450,
			scroll: 'vertical', 
			dockedItems: [{xtype: 'toolbar', 
						   items: [{text: 'New', 
						   		    ui: 'action',
						   		    handler: function() {
									   			newPanel.hide();
									   			Ext.dispatch({
							                         controller: synchronicity.controllers.contact, 
							                         action: 'showContactForm', 
							                         component: thisForm.affiliatedContacts,
							                         mode: 'add',
							                         activityGuid: thisForm.activityGuid.getValue(),
						 	                         activityId: thisForm.activityId.getValue()
							                    });
							   		  		}
						   		  },
							   	  {xtype: 'spacer'},
						   		  {xtype: 'searchfield',
							        listeners: {
								        keyup: function(e, text){
								        	var i = 0;
								        	var val = this.getValue();
								        	if (val == '') {
								        		persistentStore.filterBy(
									        			function(record){
									        				i++;
										        			if (i<21){
										        				return true;
										        			}
										        			return false;
									        			}
									        	);
					        				}
								        	else {
									        	persistentStore.filterBy(
									        			function(record){
									        				if (record.get('firstName').toUpperCase().indexOf(val.toUpperCase()) == 0 ||
									        						record.get('lastName').toUpperCase().indexOf(val.toUpperCase()) == 0){
									        					i++;
											        			if (i<21){
											        				return true;
											        			}
															}
									        				return false;
									        			}
									        	);
								        	}
								        	thisForm.conCriteria = val;
								        }
							        }
						   		   },
						   		   {xtype: 'spacer'},
							   	   {text: 'Done', 
							   		  ui: 'action',
							   		  handler: function() {
							   			newPanel.hide();
							   		  }
						   		   	}
						   		   ]
						   }],
			hideOnMaskTap: true, 
			items: [this.list]
		});
		var newPanel = new panel();
		newPanel.show();
    }

});