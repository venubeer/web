synchronicity.views.AccountOpportunity = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.accountOpportunity',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'opty',
	title: 'Opportunities',
	
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
		
		this.opportunityList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
				 		'<div class="list-item-title"> {name}',
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
			 store: synchronicity.stores.transientOpportunities,
			 ui: 'round',
			 singleSelect: true,
			 scroll: false,
			 emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No opportunities found...</div>',
			 onItemDisclosure: true,
			 listeners:{
				 itemtap : function(list, index, item, e) {
						if (e.getTarget('.x-list-disclosure')) {
							Ext.getCmp('synchronicity.views.accountList').fireEvent('navigateTo',
											list.getStore().getAt(index),
											Ext.getCmp('synchronicity.views.opportunityDetail'),
											true,
											'synchronicity.views.accountDetail');
							new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(1000);
						} else {
							Ext.dispatch({
		                         controller: synchronicity.controllers.opportunity,
		                         action: 'showOpportunityForm',
		                         record: list.getStore().getAt(index),
	 	                         component: list,
	 	                         componentSelModel: list.selModel,
	 	                         mode: 'update'
		                     });
						}
				 },
	 			 afterrender : function(cmp){
 			    	cmp.refresh();	
 			     }
			 }
		});
		
		this.opportunityFieldSet = new Ext.form.FieldSet({
				title: 'My Account Opportunities',
		        monitorOrientation: true,
		        items: [this.opportunityList]
		});
		
		this.accountFieldSet = new Ext.form.FieldSet({
			title: 'Account Info',
	        monitorOrientation: true,
	        items: [this.accountList]
		});
		
		this.items = [this.accountFieldSet, this.opportunityFieldSet];
		synchronicity.views.AccountOpportunity.superclass.initComponent.apply(this,arguments);
	 },
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.account, 
            action: 'getAccountOpportunities', 
            accountId: record.get('guid')}
		);
	}
});