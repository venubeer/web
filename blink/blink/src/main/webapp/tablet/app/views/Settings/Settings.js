synchronicity.views.Settings = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.settings',
	 scroll: 'vertical',
	 fullscreen: true,
	 initializedOn: '',
	 lastSynchronizedOn: '',
	 items: [],
	 listeners:{
		     activate : function(cmp){
		    	 
		     }
	 },	 
		 				
	 initComponent: function() {
		this.synchronizeLocalDatabase = new Ext.Button({
            text: 'Synchronize Local Database',
            id: 'synchronizeLocalDatabase',
            handler: this.onSynchronizeLocalDatabaseButtonTap,
            scope: this
        });
		
		this.initializeLocalDatabase = new Ext.Button({
            text: 'Initialize Local Database',
            id: 'initializeLocalDatabase',
            handler: this.onInitializeLocalDatabaseButtonTap,
            scope: this
        });
		
		this.userId = new Ext.form.Text({label: 'User Id', labelWidth: '30%'});
    	this.userId.disable();
    	this.userType = new Ext.form.Text({label: 'Type', labelWidth: '30%'});
    	this.userType.disable();
    	this.userTitle = new Ext.form.Text({label: 'Title', labelWidth: '30%'});
    	this.userTitle.disable();
    	this.userOrganization = new Ext.form.Text({label: 'Organization', labelWidth: '30%'});
    	this.userOrganization.disable();
    	this.lastLoggedIn = new Ext.form.Text({label: 'Last Login', labelWidth: '30%'});
    	this.lastLoggedIn.disable();
    	
    	this.initializedOn = new Ext.form.Text({label: 'Initialized On', labelWidth: '30%'});
    	this.initializedOn.disable();
    	this.lastSynchronizedOn = new Ext.form.Text({label: 'Last Syncned On', labelWidth: '30%'});
    	this.lastSynchronizedOn.disable();
    	this.initializedForUserId = new Ext.form.Text({label: 'Initialized For User Id', labelWidth: '30%'});
    	this.initializedForUserId.disable();
    	this.accountsCount = new Ext.form.Text({label: 'Account Record Count', labelWidth: '30%'});
    	this.accountsCount.disable();
    	this.contactCount = new Ext.form.Text({label: 'Contact Record Count', labelWidth: '30%'});
    	this.contactCount.disable();
    	this.activityCount = new Ext.form.Text({label: 'Activity Record Count', labelWidth: '30%'});
    	this.activityCount.disable();
    	this.optyCount = new Ext.form.Text({label: 'Opportunity Record Count', labelWidth: '30%'});
    	this.optyCount.disable();
    	this.prodCount = new Ext.form.Text({label: 'Product Record Count', labelWidth: '30%'});
    	this.prodCount.disable();
    	this.pendingTransactionCount = new Ext.form.Text({label: 'Pending Transaction Count', labelWidth: '30%'});
    	this.pendingTransactionCount.disable();
		
		this.initializeLocalDatabaseFieldSet = new Ext.form.FieldSet({
													      	  title: '',
													      	  id: 'initializeLocalDatabaseFieldSet',
													    	  instructions: 'Clears all contents of the Local Database, and re-initializes it from Server. Please make sure a High Speed connection is available prior to starting the initialization process.',
													    	  defaults: {
													    		  labelWidth: '0%'
													    	  },
													    	  items: [this.initializeLocalDatabase]
															});
		
		this.synchronizeLocalDatabaseFieldSet = new Ext.form.FieldSet({
													      	  title: '',
													      	  id: 'synchronizeLocalDatabaseFieldSet',
													    	  instructions: 'Synchronizes Local Database with the Server. Please make sure a High Speed connection is available prior to starting the synchronization process.',
													    	  defaults: {
													    		  labelWidth: '0%'
													    	  },
													    	  items: [this.synchronizeLocalDatabase]
															});
		
		this.userInfoFieldSet = new Ext.form.FieldSet({
													      	  title: 'User Information',
													      	  id: 'userInfoFieldSet',
													    	  items: [this.userId,
													    	          this.userType,
													    	          this.userTitle,
													    	          this.userOrganization,
													    	          this.lastLoggedIn
													    	          ]
															});
		
		this.databaseInfoFieldSet = new Ext.form.FieldSet({
													      	  title: 'Database Information',
													      	  id: 'databaseInfoFieldSet',
													    	  items: [this.initializedOn,
													    	          this.lastSynchronizedOn,
													    	          this.initializedForUserId,
													    	          this.accountsCount,
													    	          this.contactCount,
													    	          this.activityCount,
													    	          this.optyCount,
													    	          this.prodCount,
													    	          this.pendingTransactionCount
													    	          ]
															});
		
		this.items = [ this.initializeLocalDatabaseFieldSet, this.synchronizeLocalDatabaseFieldSet, this.databaseInfoFieldSet, this.userInfoFieldSet];
		
		synchronicity.views.Settings.superclass.initComponent.apply(this,arguments);
	},
	
	onSynchronizeLocalDatabaseButtonTap: function() {
		var thisComponent = this;
		Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
    	var task = new Ext.util.DelayedTask(function(){
    		Ext.dispatch({
	            controller: synchronicity.controllers.login,
	            action: 'checkServerAuthenticate',
	            callback: function(){
					Ext.dispatch({
			            controller: synchronicity.controllers.transaction,
			            action: 'processTransactions',
			            settingsView: this,
			            callback: function(){
			            	Ext.dispatch({
			    	            controller: synchronicity.controllers.settings,
			    	            action: 'initializeLocalDatabase',
			    	            callback: function(){
			    	            	Ext.dispatch({
			    	                    controller: synchronicity.controllers.settings,
			    	                    action: 'populateInfo',
			    	                    settingsView: thisComponent
			    	                });
			    	            },
			    	            scope: thisComponent
			    	        });
			            },
			            scope: thisComponent
			        });
	            }
    		});
		});
		task.delay(500);
	},
	
	onInitializeLocalDatabaseButtonTap: function() {
		var thisComponent = this;
		Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
    	var task = new Ext.util.DelayedTask(function(){
    		Ext.dispatch({
	            controller: synchronicity.controllers.login,
	            action: 'checkServerAuthenticate',
	            callback: function(){
					Ext.dispatch({
			            controller: synchronicity.controllers.settings,
			            action: 'initializeLocalDatabase',
			            callback: function(){
			            	Ext.dispatch({
			                    controller: synchronicity.controllers.settings,
			                    action: 'populateInfo',
			                    settingsView: thisComponent
			                });
			            },
			            scope: thisComponent
			        });
					Ext.getBody().unmask();	
	            }
    		});
		});
		task.delay(500);
	},
	 
	 
	initialize: function() {
		 var thisPanel = this;
	   	 Ext.dispatch({
             controller: synchronicity.controllers.settings,
             action: 'populateInfo',
             settingsView: thisPanel
         });
	}
	
});