synchronicity.views.ContactAccount = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.contactAccount',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'team',
	title: 'Accounts',
	
	initComponent: function() {
		var thisPanel = this;
		this.contactList = new Ext.List({
			itemTpl : new Ext.XTemplate(
			 		'<div class="list-item-title"> {lastName},&nbsp;{firstName}&nbsp;',
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
		   store: synchronicity.stores.transientContactSingle,
           ui: 'round',
	       singleSelect: true,
           scroll: false,
           disableSelection: true
		});
		
		this.accountList = new Ext.List({
			 itemTpl : new Ext.XTemplate(
					 	'<div class="list-item-title"> ',
					 	'<span class="delete-item-hidden x-button x-button-decline">',
				 		'<span class="x-button-label">Remove</span>',
				 		'</span>',
					 	'{number}&nbsp;-&nbsp;{name}',
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
		    store: synchronicity.stores.transientAccounts,
		    ui: 'round',
		    singleSelect: true,
		    scroll: false,
		    emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No accounts found...</div>',
			listeners:{
			     itemtap: function(list,index,item,e){
			    	 if (e.getTarget('.delete-item-delete')) {
			    		 Ext.dispatch({
 	                         controller: synchronicity.controllers.contact,
 	                         action: 'unAffiliateRecord',
 	                         contactId: thisPanel.contactList.getStore().first().get('id'),
 	                         contactGuid: thisPanel.contactList.getStore().first().get('guid'),
 	                         accountId: list.getStore().getAt(index).get('id'),
 	                         accountGuid: list.getStore().getAt(index).get('guid'),
 	                         currentView: 'synchronicity.views.contactAccount'
 	                     });		    		 
			    	 }
			    	 else {
			    		 var e1 = Ext.select('span.delete-item-delete',this.accountList);								    		 
			    		 if (e1.getCount()== 0){
			    			 Ext.select('span.delete-item-delete',this.accountList).removeCls('delete-item-delete');
			    			 Ext.dispatch({
		                         controller: synchronicity.controllers.account,
		                         action: 'showAccountForm',
		                         record: list.getStore().getAt(index),
		                         component: list,
		                         componentSelModel: list.selModel
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
  			    	Ext.select('span.delete-item-delete',this.accountList).removeCls('delete-item-delete');
 			    	var e1 = Ext.select('span.delete-item-hidden',item);			    	 
 			    	e1.addCls('delete-item-delete');
  			     }
			}
		});
		
		this.accountFieldSet = new Ext.form.FieldSet({
				title: 'My Contact Accounts',
		        monitorOrientation: true,
		        items: [this.accountList]
		});
		
		this.contactFieldSet = new Ext.form.FieldSet({
			title: 'Contact Info',
	        monitorOrientation: true,
	        items: [this.contactList]
		});
		
		this.items = [this.contactFieldSet, this.accountFieldSet];
		synchronicity.views.ContactAccount.superclass.initComponent.apply(this,arguments);
	 },
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.contact, 
            action: 'getContactAccounts', 
            contactId: record.get('guid')}
		);
	}
});