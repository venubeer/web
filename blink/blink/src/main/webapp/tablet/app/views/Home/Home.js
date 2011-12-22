synchronicity.views.Home = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.home',
	 scroll: 'vertical',
	 fullscreen: true,
	 items: [],
	 initComponent: function() {
		 this.alertList = new Ext.List({
			 itemTpl : '<div class="list-item-title"> {abstract}</div><div class="list-item-narrative">{message}</div>',
             store: synchronicity.stores.alerts,
             ui: 'round',
	         singleSelect: true,
             scroll: false,
             emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No alerts found. Make sure you are connected to the Internet and VPNed into Baxter network.</div>',
             listeners:{
                 itemtap: function(list,index,item,e) {
                	 Ext.dispatch({
                         controller: synchronicity.controllers.home,
                         action: 'showAlertDetail',
                         record: list.getStore().getAt(index),
                         component: list.selModel,
                         showByItem: item
                     });
                 }
			 }
 		});
		this.todayList = new Ext.List({
			itemTpl : new Ext.XTemplate(
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
             emptyText: '<div class="list-item-empty-text">No scheduled To-Do&rsquo;s/Appointments for Today. Please synchronize your local database, if you have not done so recently to get activities assigned to you, if any, from the server.</div>',
             listeners:{
			     afterrender : function(cmp){
			    	cmp.refresh();	
			     },
			     itemtap: function(list,index,item,e){
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
		
		this.alertFieldSet = new Ext.form.FieldSet({
			title: 'Alerts',
	        monitorOrientation: true,
	        items: [this.alertList]
		});
		
		this.todayFieldSet = new Ext.form.FieldSet({
			title: 'Today',
	        monitorOrientation: true,
	        items: [this.todayList]
		});
		
		this.items = [this.alertFieldSet,this.todayFieldSet];
		
		synchronicity.views.Home.superclass.initComponent.apply(this,arguments);
	 },
	 
	 
	 initialize: function() {
		Ext.getStore('synchronicity.stores.alerts').load();	
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		var transientStore = Ext.getStore('synchronicity.stores.transientActivities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		var today = new Date();
		var todayStr = today.format('m/d/Y');
		persistentStore.filterBy(function(record){
			if (record.get('startDate').indexOf(todayStr) == 0 || record.get('dueOn').indexOf(todayStr) == 0){
				return true;
			}
			return false;
		});
		persistentStore.each(function(record) {
			transientStore.add(record);
		});
		transientStore.sync();	    	
	 }
});



