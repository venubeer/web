synchronicity.views.OpportunityRevenue = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.opportunityRevenue',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'opty',
	title: 'Revenue',
	
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
		
		this.revenueList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
				 		'<div class="list-item-title">',
					 	'<span class="delete-item-hidden x-button x-button-decline">Delete</span>',
					 	'{productCode} - {productName}',
				 		'</div>',
				 		'<div class="list-item-narrative">',
				 			'Units:&nbsp;{units};&nbsp;&nbsp;',
				 			'Price:&nbsp;{price};&nbsp;&nbsp;',
				 			'Revenue Type:&nbsp;{revenueType};&nbsp;&nbsp;',
				 		'</div>',
				 		'<div class="list-item-narrative">Start Date:&nbsp;',
				 			'{revenueStartDate};&nbsp;&nbsp;End Date:&nbsp;{revenueEndDate}',
				 		'</div>'
			 ),
			 store: synchronicity.stores.transientRevenues,
			 ui: 'round',
			 singleSelect: true,
			 scroll: false,
			 emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No revenue lines found...</div>',
			 listeners:{
			     itemtap: function(list, index, item, e){
			    	 if (e.getTarget('.delete-item-delete')) {
			    		 Ext.dispatch({
	                         controller: synchronicity.controllers.opportunity,
	                         action: 'deleteRevenueLine',
	                         record: list.getStore().getAt(index),
		                     component: list,
		                     componentSelModel: list.selModel,
		                     opportunityGuid: list.getStore().getAt(index).get('opportunityGuid')
	                     });
			    	 }
			    	 else {
			    		 var e1 = Ext.select('span.delete-item-delete',this.revenueList);
			    		 if (e1.getCount()== 0){
			    			 Ext.select('span.delete-item-delete',this.revenueList).removeCls('delete-item-delete');
			    			 Ext.dispatch({
		                         controller: synchronicity.controllers.opportunity,
		                         action: 'showRevenueForm',
		                         record: list.getStore().getAt(index),
			                     component: list,
			                     componentSelModel: list.selModel,
			                     mode: 'update',
			                     opportunityGuid: list.getStore().getAt(index).get('opportunityGuid')
		                     });
			    		 }
			    		 else {
			    			 e1.removeCls('delete-item-delete');
			    			 new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(10);
			    		 }
			    	 }
                 },
	 			 afterrender : function(cmp){
 			    	cmp.refresh();	
 			     },
			     itemSwipe: function(list,index,item,e){
 			    	Ext.select('span.delete-item-delete',this.revenueList).removeCls('delete-item-delete');
			    	var e1 = Ext.select('span.delete-item-hidden',item);			    	 
			    	e1.addCls('delete-item-delete');
 			     }
			 }
		});
		
		this.revenueFieldSet = new Ext.form.FieldSet({
				title: 'Opportunity Revenue',
		        monitorOrientation: true,
		        items: [this.revenueList]
		});
		
		this.opportunityFieldSet = new Ext.form.FieldSet({
			title: 'Opportunity Info',
	        monitorOrientation: true,
	        items: [this.opportunityList]
		});
		
		this.items = [this.opportunityFieldSet, this.revenueFieldSet];
		synchronicity.views.OpportunityRevenue.superclass.initComponent.apply(this,arguments);
	},
	
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.opportunity, 
            action: 'getOpportunityRevenue', 
            optyId: record.get('guid')}
		);
	}
});