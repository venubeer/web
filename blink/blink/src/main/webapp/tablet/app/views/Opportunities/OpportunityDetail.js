synchronicity.views.OpportunityDetail = Ext.extend(Ext.TabPanel, {
	id : "synchronicity.views.opportunityDetail",
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
	items : [ new synchronicity.views.OpportunityActivity(),
			new synchronicity.views.OpportunityContact(),
			new synchronicity.views.OpportunityRevenue() ],

	listeners : {
		cardswitch : function(container, newCard, oldCard, index, animated) {
			//console.log('cardswitch');
		},
		activate : function(container) {
			//console.log(container.getActiveItem());
		}
	},

	initComponent : function() {
		synchronicity.views.OpportunityDetail.superclass.initComponent.apply(
				this, arguments);
	},

	getNavigationBarItems : function(returnTo) {
		var panelObject = this;
		this.searchIcon = new Ext.Button({
			iconCls : 'search',
			iconMask : true,
			handler : function() {
				panelObject.getActiveItem().scroller.scrollTo({x : 0,y : 0}, true);
				if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityActivity') {
					Ext.dispatch({
						controller : synchronicity.controllers.activity,
						action : 'showSearchBox',
						baxObject : this,
						optyId: panelObject.getActiveItem().opportunityList.store.first().get('guid')
					});
				}
				else if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityContact') {
					Ext.dispatch({
						controller : synchronicity.controllers.contact,
						action : 'showSearchBox',
						baxObject : this,
						optyId: panelObject.getActiveItem().opportunityList.store.first().get('guid'),
						contactIds: panelObject.getActiveItem().opportunityList.store.first().get('contactIds')
					});
				}
				else if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityRevenue') {
					Ext.dispatch({
						controller : synchronicity.controllers.opportunity,
						action : 'showSearchBox',
						baxObject : this,
						optyId: panelObject.getActiveItem().opportunityList.store.first().get('guid')
					});
				}				
			}
		});
		this.addIcon = new Ext.Button({
			iconCls : 'add',
			iconMask : true,
			handler : function() {
				if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityActivity') {
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
				                         accountGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('accountGuid'),
				                         opportunityGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('guid')
				                    });
								}
								else {
									Ext.dispatch({
										 controller: synchronicity.controllers.activity,
				                         action: 'showActivityForm',
				                         component: panelObject.getActiveItem().activityList,
				                         mode: 'add',
				                         type: 'TODO',
				                         accountGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('accountGuid'),
				                         opportunityGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('guid')
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
				else if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityContact') {
					var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
					var i=0;
					persistentStore.filterBy(function(record){
						i++;
	        			if (i<21){
	        				return true;
	        			}
	        			return false;
					});
					var opportunityId = panelObject.getActiveItem().opportunityList.store.getAt(0).get('id');
					var opportunityGuid = panelObject.getActiveItem().opportunityList.store.getAt(0).get('guid');
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
									 Ext.dispatch({
			 	                         controller: synchronicity.controllers.contact,
			 	                         action: 'affiliateRecord',
			 	                         contactId: list.getStore().getAt(index).get('id'),
			 	                         contactGuid: list.getStore().getAt(index).get('guid'),
			 	                         opportunityGuid: opportunityGuid,
			 	                         opportunityId: opportunityId
			 	                     });
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
						width: 400, 
						height: 550,
						scroll: 'vertical', 
						dockedItems: [{xtype: 'toolbar', 
									   items: [{text: 'New', 
									   		  	ui: 'action',
									   		  	handler: function() {
									   			newPanel.hide();
									   			Ext.dispatch({
							                         controller: synchronicity.controllers.contact, 
							                         action: 'showContactForm', 
							                         component: panelObject.getActiveItem().contactList,
							                         mode: 'add',
							                         //accountGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('accountGuid'),
							                         opportunityGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('guid'),
							                         opportunityId: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('id')
									   				});
									   		  	}},
									   		  	{xtype: 'spacer'},
									   		  	{xtype: 'searchfield',
										        listeners: {
											        keyup: function(e, text){
											        	var i=0;
											        	var val = this.getValue();
											        	if (val == ''){
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
												        				if (record.get('firstName').toUpperCase().indexOf(val.toUpperCase()) == 0 ||
												        						record.get('lastName').toUpperCase().indexOf(val.toUpperCase()) == 0)
												        					 {
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
				else if (panelObject.getActiveItem().getId() == 'synchronicity.views.opportunityRevenue') {
					Ext.dispatch({
                         controller: synchronicity.controllers.opportunity,
                         action: 'showRevenueForm',
                         component: panelObject.getActiveItem().revenueList,
                         mode: 'add',
                         opportunityGuid: panelObject.getActiveItem().opportunityList.getStore().getAt(0).get('guid')
                    });
				}
			}
		});
		this.backButton = {
			text : 'Back',
			ui : 'back',
			handler : function() {
				Ext.getCmp('synchronicity.views.opportunityDetail').fireEvent(
																			'navigateTo', 
																			null,
																			Ext.getCmp(returnTo),
																			false);
				panelObject.setActiveItem(panelObject.items.first(),'slide');
			}
		};
		this.navigationBarItems = [ this.backButton, {
			xtype : 'spacer'
		}, this.addIcon, this.searchIcon ];
		return this.navigationBarItems;
	},

	initialize : function(record, from) {
		var store = Ext.getStore('synchronicity.stores.transientOpportunitySingle');
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