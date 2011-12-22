synchronicity.views.AccountList = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.accountList',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	 
	initComponent: function() {
		 this.list = new Ext.List({
				 itemTpl : new Ext.XTemplate(
						 		'<div>',
						 		'<div class="list-item-title"> {number}&nbsp;-&nbsp;{name}',
						 		'<tpl if="focusAccount==\'Y\'">',
						 			'&nbsp;&nbsp;**',
					 			'</tpl>',
						 		'</div>',
						 		'<div class="list-item-narrative">{addressLine1}',
						 		'<tpl if="addressLine2">',
						 			',&nbsp;',
						 		'</tpl>',
						 		'{addressLine2}',
						 		'<tpl if="city">',
					 				',&nbsp;',
					 			'</tpl>',
						 		'{city}',
						 		'<tpl if="state">',
					 				',&nbsp;',
					 			'</tpl>',
						 		'{state}&nbsp;{zipcode}</div>',
						 		'<div class="list-item-narrative">',
						 			'Type:&nbsp;{type};&nbsp;&nbsp;',
						 			'Class:&nbsp;{class};&nbsp;&nbsp;',
						 			'Billing&nbsp;Type:&nbsp;{billingType}',
						 		'</div>',
						 		'</div>'),
                 store: synchronicity.stores.transientAccounts,
                 ui: 'round',
    	         singleSelect: true,
                 scroll: false,
                 emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No accounts found...</div>',
                 onItemDisclosure: true,
    	 		 listeners:{
    	 			 itemtap : function(list,index,item,e){
    	 			     	if (e.getTarget('.x-list-disclosure')) {
    	 			     		list.selModel.view.getSelectionModel().deselectAll();
    	 			     		Ext.getCmp('synchronicity.views.accountList').fireEvent('navigateTo', 
    	 			     																list.getStore().getAt(index),
    	 			     																Ext.getCmp('synchronicity.views.accountDetail'),
    	 			     																true);
    	 			     		new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(1000);
    	 			     	} 
    	 			     	else {
    	 			     		Ext.dispatch({
    	 	                         controller: synchronicity.controllers.account,
    	 	                         action: 'showAccountForm',
    	 	                         record: list.getStore().getAt(index),
    	 	                         component: list,
    	 	                         componentSelModel: list.selModel
    	 	                     });
    	 			     	}
    	 			 }
				 }
 		});
		
		this.fieldSet = new Ext.form.FieldSet({
				title: 'My Accounts',
		        monitorOrientation: true,
		        items: [this.list]
		});
		
		this.items = [this.fieldSet];
		
		synchronicity.views.AccountList.superclass.initComponent.apply(this,arguments);
	 },

	 getNavigationBarItems: function(){
		 var panelObject = this;
		 this.searchIcon = new Ext.Button({
					            iconCls: 'search',
					            iconMask: true,
					            handler: function(){
					            	panelObject.scroller.scrollTo({x: 0, y: 0}, true);
					            	Ext.dispatch({
				                         controller: synchronicity.controllers.account,
				                         action: 'showSearchBox',
				                         baxObject: this
				                     });					            	 
					            }					            
					        });
			
		 this.navigationBarItems = [{xtype: 'spacer'}, this.searchIcon];
		 return this.navigationBarItems;
	 },
	 
	 
	 initialize: function() {
		 Ext.dispatch({
	            controller: synchronicity.controllers.account,
	            action: 'initializeAccountList'
	        }); 
	 }
});



