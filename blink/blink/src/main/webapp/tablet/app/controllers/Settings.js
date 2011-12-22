synchronicity.controllers.settings = new Ext.Controller({
	
	populateInfo: function(options){
		var store = Ext.getStore('synchronicity.stores.settings');
		store.load();
		var first = store.first();
		
		options.settingsView.userId.setValue(first.data.userId);
		options.settingsView.userType.setValue(first.data.userType);
		options.settingsView.userTitle.setValue(first.data.userTitle);
		options.settingsView.userOrganization.setValue(first.data.userOrganization);
		options.settingsView.lastLoggedIn.setValue(first.data.lastLoggedIn);
			
		options.settingsView.initializedOn.setValue(first.data.initializedOn);
		options.settingsView.initializedForUserId.setValue(first.data.userId+' - '+first.data.userTitle);
		options.settingsView.lastSynchronizedOn.setValue(first.data.lastSynchronizedOn);
			
		if (!this.acStore) {
			this.acStore = Ext.getStore('synchronicity.stores.persistentAccounts');
		}
		this.acStore.filterBy(function(record){
			return true;
		});
		options.settingsView.accountsCount.setValue(this.acStore.data.length.toString());

		if (!this.conStore) {
			this.conStore = Ext.getStore('synchronicity.stores.persistentContacts');
		};
		this.conStore.filterBy(function(record){
			return true;
		});
		options.settingsView.contactCount.setValue(this.conStore.data.length.toString());

		if (!this.actStore) {
			this.actStore = Ext.getStore('synchronicity.stores.persistentActivities');
		};
		this.actStore.filterBy(function(record){
			return true;
		});
		options.settingsView.activityCount.setValue(this.actStore.data.length.toString());
        	
		if (!this.optyStore) {
			this.optyStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
		};
		this.optyStore.filterBy(function(record){
			return true;
		});
		options.settingsView.optyCount.setValue(this.optyStore.data.length.toString());
		
		if (!this.prodStore) {
			this.prodStore = Ext.getStore('synchronicity.stores.persistentProducts');
		};
		this.prodStore.filterBy(function(record){
			return true;
		});
		options.settingsView.prodCount.setValue(this.prodStore.data.length.toString());
		
		if (!this.transStore) {
			this.transStore = Ext.getStore('synchronicity.stores.transactions');
		};
		this.transStore.filterBy(function(record){
			return true;
		});
		options.settingsView.pendingTransactionCount.setValue(this.transStore.data.length.toString());
	},


	initializeLocalDatabase: function(options) {
		var store = Ext.getStore('synchronicity.stores.settings');
		store.load();
		var first = store.first();
		if (window.localStorage) {
			window.localStorage.clear();
		}
		var store = Ext.getStore('synchronicity.stores.settings');
		store.load();
		store.add(first);
		store.sync();
		Ext.dispatch({
	        controller: synchronicity.controllers.dataInitializer,
	        action: 'initialize',
	        initDate: new Date(),
	        callback: function(){
	        	var callback = options.callback;   
				if (typeof callback == 'function') {
		            callback.call(options.scope);
		        }
				synchronicity.app.properties.autologin=true;
				window.location = 'index.html?autoAuthenticate=true';
	        },
	        scope: options.scope
	    });
	}
	
});