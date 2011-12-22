synchronicity.controllers.transaction = new Ext.Controller({
	
	insert: function(options){
		var thisController = this;
		var store = Ext.getStore('synchronicity.stores.transactions');
		var record = thisController.getRecord(options);
		if (record) {
			if (options.operation == 'delete') {
				store.remove(record);
			}
			if (options.force) {
				store.add({type: options.type,
					   	   objectId: options.objectId,
					   	   operation: options.operation,
					   	   childObjectId: options.childObjectId
						});
				store.sync();
			}
		}
		else {
			store.add({type: options.type,
				   	   objectId: options.objectId,
				   	   operation: options.operation,
				   	   childObjectId: options.childObjectId?options.childObjectId:''
					});
			store.sync();
		}
	},

	remove: function(options){
		var store = Ext.getStore('synchronicity.stores.transactions');
		var record = store.getById(options.record.data.id);
		store.remove(record);
		store.sync();
	},
	
	getRecord: function(options){
		var store = Ext.getStore('synchronicity.stores.transactions');
		store.clearFilter(true);
		store.load();
		store.filter([{property: 'type', value: options.type, exactMatch: true, anyMatch: true},
					 {property: 'objectId', value: options.objectId, exactMatch: true, anyMatch: true}]);
		var first = store.first();
		if (first) {
			return first;
		}
		else {
			return null;
		}
	},
	
	processTransactions: function(options){
		var thisController = this;
		try {
			var store = Ext.getStore('synchronicity.stores.transactions');
			var mode = options.mode;
			var record = options.record;
			if (mode==null){
				Ext.getBody().mask('<div class="demos-loading">Processing...</div>');
			}
			if (mode=="next") {
				thisController.remove(options);
			}
			var first = store.first();
			if (first && first.data.type=="Account") {
				Ext.dispatch({
		            controller: synchronicity.controllers.account,
		            action: 'processServerUpdate',
		            record: first,
		            callback: function(){
		            	Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'processTransactions',
				            record: first,
				            mode: 'next',
				            callback: options.callback	
		            	});
		            },
		            scope: thisController
		        });
			}
			else if (first && first.data.type=="Contact") {
				Ext.dispatch({
		            controller: synchronicity.controllers.contact,
		            action: 'processServerUpdate',
		            record: first,
		            callback: function(){
		            	Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'processTransactions',
				            record: first,
				            mode: 'next',
				            callback: options.callback	
		            	});
		            },
		            scope: thisController
		        });
			}
			else if (first && first.data.type=="Activity") {
				Ext.dispatch({
		            controller: synchronicity.controllers.activity,
		            action: 'processServerUpdate',
		            record: first,
		            callback: function(){
		            	Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'processTransactions',
				            record: first,
				            mode: 'next',
				            callback: options.callback	
		            	});
		            },
		            scope: thisController
		        });
			}
			else if (first && first.data.type=="Opportunity") {
				Ext.dispatch({
		            controller: synchronicity.controllers.opportunity,
		            action: 'processServerUpdate',
		            record: first,
		            callback: function(){
		            	Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'processTransactions',
				            record: first,
				            mode: 'next',
				            callback: options.callback	
		            	});
		            },
		            scope: thisController
		        });
			}
			else if (first && first.data.type=="Revenue") {
				Ext.dispatch({
		            controller: synchronicity.controllers.opportunity,
		            action: 'processServerRevenueUpdate',
		            record: first,
		            callback: function(){
		            	Ext.dispatch({
				            controller: synchronicity.controllers.transaction,
				            action: 'processTransactions',
				            record: first,
				            mode: 'next',
				            callback: options.callback	
		            	});
		            },
		            scope: thisController
		        });
			}
			else if (first){
				Ext.getBody().unmask();
				if (!this.error) {
					this.error = new synchronicity.views.AlertPop({html: 'Incorrect transaction type. Contact Application support team.',
																invoke: function(val) {}
																});
				}
				this.error.show();
			}				
			else {
				store.getProxy().clear();
				var settings = Ext.getStore('synchronicity.stores.settings');
				var settingsFirst = settings.first();
				var date = new Date();
				if (settingsFirst) {
					settingsFirst.set('lastSynchronizedOn',date);
				}
				settings.sync();
				var callback = options.callback;        
		        if (typeof callback == 'function') {
		            callback.call(options.scope);
		        }
		        Ext.getBody().unmask();				
			}
		}
		catch(e) {
			Ext.getBody().unmask();
			if (!this.error) {
				this.error = new synchronicity.views.AlertPop({html: 'Unknown error. Could not process all pending transactions.',
															invoke: function(val) {}
															});
			}
			this.error.show();
		}
	}
	
});