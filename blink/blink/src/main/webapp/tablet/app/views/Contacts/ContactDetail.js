synchronicity.views.ContactDetail = Ext.extend(Ext.TabPanel,{
	id : "synchronicity.views.contactDetail",
	fullscreen : true,
	tabBar : {
		dock : 'bottom',
		ui : 'light',
		layout : {
			pack : 'center'
		}
	},
	cardSwitchAnimation : {
		type : 'slide',
		cover : true
	},
	defaults : {
		scroll : 'vertical'
	},
	items : [ new synchronicity.views.ContactActivity(),
			new synchronicity.views.ContactAccount(),
			new synchronicity.views.ContactOpportunity() ],

	listeners : {
		cardswitch : function(container, newCard, oldCard,index, animated) {
			if (this.getActiveItem().getId() == 'synchronicity.views.contactOpportunity'){
				this.addIcon.hide();
			}
			else {
				this.addIcon.show();
			}
		},
		activate : function(container) {
			if (this.getActiveItem().getId() == 'synchronicity.views.contactOpportunity'){
				this.addIcon.hide();
			}
			else {
				this.addIcon.show();
			}
		}
	},

	initComponent : function() {
		synchronicity.views.ContactDetail.superclass.initComponent.apply(this, arguments);
	},

	getNavigationBarItems : function() {
		var panelObject = this;
		this.searchIcon = new Ext.Button({
					iconCls : 'search',
					iconMask : true,
					handler : function() {
						panelObject.getActiveItem().scroller.scrollTo({x : 0,y : 0}, true);
						if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactActivity') {
							Ext.dispatch({
								controller : synchronicity.controllers.activity,
								action : 'showSearchBox',
								baxObject : this,
								contactId: panelObject.getActiveItem().contactList.store.first().get('guid')
							});
						}
						else if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactAccount') {
							Ext.dispatch({
								controller : synchronicity.controllers.account,
								action : 'showSearchBox',
								baxObject : this,
								contactId: panelObject.getActiveItem().contactList.store.first().get('guid')
							});
						}
						else if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactOpportunity') {
							Ext.dispatch({
								controller : synchronicity.controllers.opportunity,
								action : 'showSearchBox',
								baxObject : this,
								contactId: panelObject.getActiveItem().contactList.store.first().get('guid')
							});
						}		
					}
				});
		this.addIcon = new Ext.Button({
					iconCls : 'add',
					iconMask : true,
					handler : function() {
						if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactActivity') {
							Ext.regModel('NewActivityOptions', {fields: ['option']});
							var store = new Ext.data.JsonStore({
							    model  : 'NewActivityOptions', data: [{option: 'Appointment'},{option: 'To Do'}]
							});							
							var list = new Ext.List({
							    itemTpl : '{option}',
						    	store: store,
						    	listeners:{
									itemtap: function(list,index,item,e){
										newPanel.hide();
										list.selModel.view.getSelectionModel().deselectAll();
										if (list.getStore().getAt(index).get('option') == 'Appointment') {
											Ext.dispatch({
						                         controller: synchronicity.controllers.activity,
						                         action: 'showActivityForm',
						                         component: panelObject.getActiveItem().activityList,
						                         mode: 'add',
						                         type: 'APPOINTMENT',
						                         contactGuid: panelObject.getActiveItem().contactList.getStore().getAt(0).get('guid')
						                    });
										}
										else {
											Ext.dispatch({
												 controller: synchronicity.controllers.activity,
						                         action: 'showActivityForm',
						                         component: panelObject.getActiveItem().activityList,
						                         mode: 'add',
						                         type: 'TODO',
						                         contactGuid: panelObject.getActiveItem().contactList.getStore().getAt(0).get('guid')
						                    });
										}
						             }
						    	}
							});
							var panel = Ext.extend(Ext.Panel, {
								floating: true, modal: true, width: 300, scroll: false, hideOnMaskTap: true, items: [list],
								layoutOrientation : function(orientation, w, h) {
                                    this.hide();
                                }
							});
							var newPanel = new panel();
							newPanel.showBy(this);
						}
						else if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactAccount') {
							var persistentStore = Ext.getStore('synchronicity.stores.persistentAccounts');
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
								 		'{number}</div>',
						 				'<div class="list-item-narrative">{name}</div>'),
						    	store: persistentStore,
						    	scroll: false,
						    	listeners:{
									itemtap: function(list,index,item,e){
										 if (e.getTarget('.delete-item-delete')) {
											 Ext.dispatch({
					 	                         controller: synchronicity.controllers.contact,
					 	                         action: 'affiliateRecord',
					 	                         contactId: panelObject.getActiveItem().contactList.store.getAt(0).get('id'),
					 	                         contactGuid: panelObject.getActiveItem().contactList.store.getAt(0).get('guid'),
					 	                         accountGuid: list.getStore().getAt(index).get('guid'),
					 	                         accountId: list.getStore().getAt(index).get('id')
					 	                     });
											 Ext.select('span.delete-item-delete',this.list).removeCls('delete-item-delete');		    		 
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
								width: 350, 
								height: 500,
								scroll: 'vertical', 
								dockedItems: [{xtype: 'toolbar', 
											   items: [{xtype: 'searchfield',
												        listeners: {
													        keyup: function(e, text){
													        	var i=0;
													        	var val = this.getValue();
													        	if (val==''){
													        		persistentStore.filterBy(function(record){
													        			i++;
													        			if (i<21){
													        				return true;
													        			}
													        			return false;
													        		});
													        	}
													        	else {
													        		persistentStore.filterBy(
													        			function(record, id){
													        				if (record.get('number').toUpperCase().indexOf(val.toUpperCase()) == 0 ||
													        						record.get('name').toUpperCase().indexOf(val.toUpperCase()) == 0){
													        					i++;
															        			if (i<21){
															        				return true;
															        			}
																			}
													        				return false;
													        			}
													        		);
													        	}
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
								items: [this.list],
								layoutOrientation : function(orientation, w, h) {
                                    this.hide();
                                }
							});
							var newPanel = new panel();
							newPanel.showBy(this);
						}
						else if (panelObject.getActiveItem().getId() == 'synchronicity.views.contactOpportunity') {
							Ext.dispatch({
		                         controller: synchronicity.controllers.opportunity,
		                         action: 'showOpportunityForm',
		                         component: panelObject.getActiveItem().opportunityList,
		                         mode: 'add'
		                    });
						}
					}
				});
		this.backButton = {
			text : 'Back',
			ui : 'back',
			handler : function() {
				Ext.getCmp('synchronicity.views.contactDetail').fireEvent(
																	'navigateTo',
																	null,
																	Ext.getCmp('synchronicity.views.contactList'),
																	false);
				panelObject.setActiveItem(panelObject.items.first(),'slide');
			}
		};
		this.navigationBarItems = [ this.backButton, {
			xtype : 'spacer'
		}, this.addIcon, this.searchIcon ];
		return this.navigationBarItems;
	},

	initialize : function(record) {
		var store = Ext.getStore('synchronicity.stores.transientContactSingle');
		var thisProxy = store.getProxy();
		var model = new thisProxy.model({});
		model.data = record.data;
		store.removeAt(0);
		store.add(model);
		this.items.each(function(item, index, length) {
			item.initialize(record);
		});
	}
});