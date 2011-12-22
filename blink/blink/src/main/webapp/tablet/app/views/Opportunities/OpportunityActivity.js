synchronicity.views.OpportunityActivity = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.opportunityActivity',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'time',
	title: 'Activities',
	
	initComponent: function() {
		this.opportunityList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
					 '<div class="list-item-title"> {name}',
				 		'</div>',
				 		'<div class="list-item-narrative">',
				 			'Account:&nbsp; {accountNumber}&nbsp;-&nbsp;{accountName}',
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
				 		'<tpl if="this.isNull(salesMethod) == false">',
				 			'Sales Method:&nbsp;{salesMethod};&nbsp;&nbsp;',
				 		'</tpl>',
				 		'<tpl if="this.isNull(salesMethod) == true">',
				 			'Sales Method:&nbsp;N/A;&nbsp;&nbsp;',
				 		'</tpl>',
				 		'<tpl if="this.isNull(salesStage) == false">',
				 			'Sales Stage:&nbsp;{salesStage};&nbsp;&nbsp;',
				 		'</tpl>',
				 		'<tpl if="this.isNull(salesStage) == true">',
				 			'Sales Stage:&nbsp;N/A;&nbsp;&nbsp;',
				 		'</tpl>',
				 		'Close Date:&nbsp;{closeDate}',
				 		'</div>',
				 		'<div class="list-item-narrative">Probability:&nbsp;',
				 		'<tpl if="this.isNull(probability) == false">',
				 			'{probability}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(probability) == true">',
				 			'N/A',
				 		'</tpl>',
				 		';&nbsp;&nbsp;Revenue:&nbsp;',
				 		'<tpl if="this.isNull(revenue) == false">',
				 			'{revenue}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(revenue) == true">',
				 			'N/A',
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
		   store: synchronicity.stores.transientOpportunitySingle,
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
		    store: synchronicity.stores.transientOpportunityActivities,
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
				title: 'My Opportunity Activities',
		        monitorOrientation: true,
		        items: [this.activityList]
		});
		
		this.opportunityFieldSet = new Ext.form.FieldSet({
			title: 'Opportunity Info',
	        monitorOrientation: true,
	        items: [this.opportunityList]
		});
		
		this.items = [this.opportunityFieldSet, this.activityFieldSet];
		synchronicity.views.OpportunityActivity.superclass.initComponent.apply(this,arguments);
	 },
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.opportunity, 
            action: 'getOpportunityActivities', 
            optyId: record.get('guid')}
		);
	}
});