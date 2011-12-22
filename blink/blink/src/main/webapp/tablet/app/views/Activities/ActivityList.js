synchronicity.views.ActivityList = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.activityList',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	 
	initComponent: function() {
		 this.list = new Ext.List({
				 itemTpl : new Ext.XTemplate(
						 		'<div>',
						 		'<div class="list-item-title"> {subject}</div>',
						 		'<div class="list-item-narrative">',
						 		'<tpl if="this.isNull(accountNumber) == false">',
						 			'Account:&nbsp; {accountNumber}&nbsp;-&nbsp;{accountName}',
						 		'</tpl>',
							 	'<tpl if="this.isNull(accountNumber) == true">',
							 		'Account:&nbsp; N/A',
						 		'</tpl>',
						 		'</div>',
						 		'<div class="list-item-narrative">',
						 		'<tpl if="this.isNull(primaryContact) == false">',
						 			'Primary Contact:&nbsp;{primaryContact}',
						 		'</tpl>',
						 		'<tpl if="this.isNull(primaryContact) == true">',
						 			'Primary Contact:&nbsp;N/A',
						 		'</tpl>',
						 		'</div>',
						 		'<div class="list-item-narrative">',
						 		'<tpl if="category == \'APPOINTMENT\'">',
						 			'Start Time: &nbsp;{startDate}',
						 			'<tpl if="endDate">',
						 				';&nbsp;&nbsp;End Time:&nbsp;{endDate}',
						 			'</tpl>',
						 		'</tpl>',
						 		'<tpl if="category == \'TO DO\'">',
						 			'Due Date: &nbsp;{dueOn}',
						 		'</tpl>',
						 		'</div>',
						 		'<div class="list-item-narrative">',
						 			'Type:&nbsp;{type};&nbsp;&nbsp;',
						 			'Status:&nbsp;{status}',
						 			'<tpl if="this.isNull(status) == true">',
						 				'Open',
						 			'</tpl>',
						 		'</div>',	
						 		'</div>',
						 		{
						 			isNull: function(val){
						 				if (val.trim()==''){
						 					return true;
						 				}
						 				if (val) {
						 					return false;
						 				}
						 				return true;
						 			}
						 		}
						),
                 store: synchronicity.stores.transientActivities,
                 ui: 'round',
    	         singleSelect: true,
                 scroll: false,
                 emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No activities found...</div>',
    	 		 listeners:{
    	 			 itemtap : function(list,index,item,e){
    	 				Ext.dispatch({
	                         controller: synchronicity.controllers.activity,
	                         action: 'showActivityForm',
	                         record: list.getStore().getAt(index),
	                         component: list,
	                         componentSelModel: list.selModel,
	                         mode: 'update'
	                     });
    	 			 }
				 }
 		});
		
		this.fieldSet = new Ext.form.FieldSet({
				title: 'My Activities',
		        monitorOrientation: true,
		        items: [this.list]
		});
		
		this.items = [this.fieldSet];
		
		synchronicity.views.ActivityList.superclass.initComponent.apply(this,arguments);
	 },

	 getNavigationBarItems: function(){
		 var panelObject = this;
		 this.searchIcon = new Ext.Button({
					            iconCls: 'search',
					            iconMask: true,
					            handler: function(){
					            	panelObject.scroller.scrollTo({x: 0, y: 0}, true);
					            	Ext.dispatch({
				                         controller: synchronicity.controllers.activity,
				                         action: 'showSearchBox',
				                         baxObject: this
				                     });
					            }					            
					        });
		 this.addIcon = new Ext.Button({
	            iconCls: 'add',
	            iconMask: true,
	            handler: function(){
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
				                         component: panelObject.list,
				                         mode: 'add',
				                         type: 'APPOINTMENT'
				                    });
								}
								else {
									Ext.dispatch({
										 controller: synchronicity.controllers.activity,
				                         action: 'showActivityForm',
				                         component: panelObject.list,
				                         mode: 'add',
				                         type: 'TODO'
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
	        });
		 this.navigationBarItems = [{xtype: 'spacer'}, this.addIcon, this.searchIcon];
		 return this.navigationBarItems;
	 },
	 
	 
	 initialize: function() {
		 Ext.dispatch({
	            controller: synchronicity.controllers.activity,
	            action: 'initializeActivityList'
	        }); 
	 }
});



