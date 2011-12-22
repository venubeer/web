synchronicity.views.OpportunityContact = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.opportunityContact',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'user',
	title: 'Contacts',
	
	initComponent: function() {
		var thisPanel = this;
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
		
		
		this.contactList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
					 	'<div class="list-item-title">', 
					 	'<span class="delete-item-hidden x-button x-button-decline">',
				 		'<span class="x-button-label">Remove</span>',
				 		'</span>',
				 		'{lastName},&nbsp;{firstName}&nbsp;',
				 		'<tpl if="this.isNull(department) == false">',
				 			'({department}/{title})',
				 		'</tpl>',
				 		'<tpl if="this.isNull(department) == true">',
				 			'(No Department/Title)',
				 		'</tpl>',
				 		'</div>',
				 		'<div class="list-item-narrative">',
				 		'<tpl if="this.isNull(addressLine1+addressLine2+city+state+zipcode) == true">',
				 			'No Address Info',
				 		'</tpl>',
				 		'{addressLine1}',
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
				 		'{state}&nbsp;{zipcode}',
			 			'</div>',
				 		'<div class="list-item-narrative">Work#:&nbsp;',
				 		'<tpl if="this.isNull(workPhone) == false">',
				 			'{workPhone}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(workPhone) == true">',
				 			'N/A',
				 		'</tpl>',
				 		';&nbsp;&nbsp;Cell#:&nbsp;',
				 		'<tpl if="this.isNull(cellPhone) == false">',
				 			'{cellPhone}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(cellPhone) == true">',
				 			'N/A',
				 		'</tpl>',
				 		';&nbsp;&nbsp;E-Mail:&nbsp;',
				 		'<tpl if="this.isNull(email) == false">',
				 			'{email}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(email) == true">',
				 			'N/A',
				 		'</tpl>',
				 		'</div>',	
				 		{
				 			isNull: function(val){
				 				if (val) {
				 					return false;
				 				}
				 				return true;
				 			}
				 		}
			 
			 ),
		    store: synchronicity.stores.transientOpportunityContacts,
		    ui: 'round',
		    singleSelect: true,
		    scroll: false,
		    emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No contacts found...</div>',
			listeners:{
			     itemtap: function(list,index,item,e){
			    	 if (e.getTarget('.delete-item-delete')) {
			    		 Ext.dispatch({
 	                         controller: synchronicity.controllers.contact,
 	                         action: 'unAffiliateRecord',
 	                         contactId: list.getStore().getAt(index).get('id'),
 	                         contactGuid: list.getStore().getAt(index).get('guid'),
 	                         opportunityId: thisPanel.opportunityList.getStore().first().get('id'),
 	                         opportunityGuid: thisPanel.opportunityList.getStore().first().get('guid')
 	                     });			    		 
			    	 }
			    	 else {
			    		 var e1 = Ext.select('span.delete-item-delete',this.contactList);								    		 
			    		 if (e1.getCount()== 0){
			    			 Ext.select('span.delete-item-delete',this.contactList).removeCls('delete-item-delete');
			    			 Ext.dispatch({
		                         controller: synchronicity.controllers.contact,
		                         action: 'showContactForm',
		                         record: list.getStore().getAt(index),
		                         component: list,
		                         componentSelModel: list.selModel,
		                         mode: 'update'
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
  			    	Ext.select('span.delete-item-delete',this.contactList).removeCls('delete-item-delete');
 			    	var e1 = Ext.select('span.delete-item-hidden',item);			    	 
 			    	e1.addCls('delete-item-delete');
  			     }	 
			}
		});
		
		this.contactFieldSet = new Ext.form.FieldSet({
				title: 'My Opportunity Contacts',
		        monitorOrientation: true,
		        items: [this.contactList]
		});
		
		this.opportunityFieldSet = new Ext.form.FieldSet({
			title: 'Opportunity Info',
	        monitorOrientation: true,
	        items: [this.opportunityList]
		});
		
		this.items = [this.opportunityFieldSet, this.contactFieldSet];
		synchronicity.views.OpportunityContact.superclass.initComponent.apply(this,arguments);
	 },
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.opportunity, 
            action: 'getOpportunityContacts', 
            contactIds: record.get('contactIds')}
		);
	}
});