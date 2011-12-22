synchronicity.views.ContactActivity = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.contactActivity',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
	iconCls: 'time',
	title: 'Activities',
	
	initComponent: function() {
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
		    store: synchronicity.stores.transientContactActivities,
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
                        mode: 'update'
                    });
	             },
	 			 afterrender : function(cmp){
 			    	cmp.refresh();	
 			     }	
			}
		});
		
		this.activityFieldSet = new Ext.form.FieldSet({
				title: 'My Contact Activities',
		        monitorOrientation: true,
		        items: [this.activityList]
		});
		
		this.contactFieldSet = new Ext.form.FieldSet({
			title: 'Contact Info',
	        monitorOrientation: true,
	        items: [this.contactList]
		});
		
		this.items = [this.contactFieldSet, this.activityFieldSet];
		synchronicity.views.ContactActivity.superclass.initComponent.apply(this,arguments);
	 },
	    
	initialize: function(record) {
		Ext.dispatch({
            controller: synchronicity.controllers.contact, 
            action: 'getContactActivities', 
            contactId: record.get('guid')}
		);
	}
});