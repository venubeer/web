synchronicity.views.AccountActivity = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.accountActivity',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'time',
	title: 'Activities',
	
	initComponent: function() {
		this.accountList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
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
					 		'</div>'
										),
		   store: synchronicity.stores.transientAccountSingle,
           ui: 'round',
	       singleSelect: true,
           scroll: false,
           disableSelection: true
		});
		
		this.activityList = new Ext.List({
			itemTpl : new Ext.XTemplate(
			 		'<div class="list-item-title"> {subject}</div>',
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
		    store: synchronicity.stores.transientAccountActivities,
		    ui: 'round',
		    singleSelect: true,
		    scroll: false,
		    emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No activities found...</div>',
			listeners:{
			     itemtap: function(list,index,item,e){
			    	 Ext.dispatch({
                         controller: synchronicity.controllers.activity,
                         action: 'showActivityForm',
                         record: list.getStore().getAt(index),
                         component: list,
                         componentSelModel: list.selModel,
                         mode: 'update',
                         accountGuid: list.getStore().getAt(index).get('accountGuid')
                     });
	             },
	 			 afterrender : function(cmp){
 			    	cmp.refresh();	
 			     }	
			}
		});
		
		this.activityFieldSet = new Ext.form.FieldSet({
				title: 'My Account Activities',
		        monitorOrientation: true,
		        items: [this.activityList]
		});
		
		this.accountFieldSet = new Ext.form.FieldSet({
			title: 'Account Info',
	        monitorOrientation: true,
	        items: [this.accountList]
		});
		
		this.items = [this.accountFieldSet, this.activityFieldSet];
		synchronicity.views.AccountActivity.superclass.initComponent.apply(this,arguments);
	 },
	 
	    
	 initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.account, 
            action: 'getAccountActivities', 
            accountId: record.get('guid')}
		);
	}
});