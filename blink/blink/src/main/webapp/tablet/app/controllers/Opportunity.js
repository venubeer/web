synchronicity.controllers.opportunity = new Ext.Controller({
	
	initializeOpportunityList: function(options) {
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
		var transientStore = Ext.getStore('synchronicity.stores.transientOpportunities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return true;
		});
		thisController.copyStore(persistentStore, transientStore, 20);
		transientStore.sync();
	},
	
	
	getOpportunityActivities: function(options){
		var thisController = this;
		var id = options.optyId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentActivities');
		var transientStore = Ext.getStore('synchronicity.stores.transientOpportunityActivities');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return record.get('opportunityGuid').indexOf(id)!= -1;
		});
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();		
	},
	
	
	getOpportunityContacts: function(options){
		var thisController = this;
		var ids = options.contactIds;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentContacts');
		var transientStore = Ext.getStore('synchronicity.stores.transientOpportunityContacts');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(	
									function(record, id){
										return ids.indexOf(record.get('guid'))!= -1;
									}
								);
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	
	
	getOpportunityRevenue: function(options){
		var thisController = this;
		var id = options.optyId;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentRevenues');
		var transientStore = Ext.getStore('synchronicity.stores.transientRevenues');
		transientStore.each(function(record) {
			transientStore.remove(record);
        });
		persistentStore.filterBy(function(record){
			return record.get('opportunityGuid').indexOf(id) != -1 && record.get('revenueClass') == 'Summary';
		});
		thisController.copyStore(persistentStore, transientStore);
		transientStore.sync();	
	},
	
	
	showSearchBox: function(options){
		var thisController = this;
		this.search = new synchronicity.views.SearchPop({invoke: function(val) {
				Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
				var task = new Ext.util.DelayedTask(function(){
					var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
					var transientStore = Ext.getStore('synchronicity.stores.transientOpportunities');
					transientStore.each(function(record) {
						transientStore.remove(record);
			        });
					persistentStore.filterBy(function(record, id){
												if (((options.accountId && options.accountId == record.get('accountGuid')) || 
													(options.contactId && record.get('contactIds').indexOf(options.contactId) > -1)||
													(options.accountId==null && options.contactId==null))&&
													(val==''||
													record.get('name').toUpperCase().indexOf(val.toUpperCase()) > -1 ||
													record.get('accountNumber').toUpperCase().indexOf(val.toUpperCase()) > -1||
													record.get('accountName').toUpperCase().indexOf(val.toUpperCase()) > -1)){
												
													return true;
												}
												return false;
											});
					thisController.copyStore(persistentStore, transientStore, 20);
					transientStore.sync();
					Ext.getBody().unmask();	
				});
				task.delay(500);
			}
			});
		this.search.showBy(options.baxObject);
	},
	
	
	copyStore: function(fromStore,toStore,numRows){
		var i = 0;
		fromStore.each(function(record) {
			i++;
			if (numRows==null || i <= numRows){
				toStore.add(record);
			}
			else {
				return;
			}
        });
	},
	
	showOpportunityForm: function(options){
		this.list = options.component;
		this.record = options.record;
		this.mode = options.mode;
		this.accountGuid = options.accountGuid;
		this.opportunityForm = new synchronicity.views.OpportunityForm({
			salesMethod: options.mode == 'update'?this.record.data.salesMethod:" ",
			salesStage: options.mode == 'update'?this.record.data.salesStage:" ",
			listeners: {
                scope: this,
                hide : function() {
                	if (options.mode == 'update'){
                		options.componentSelModel.view.getSelectionModel().deselectAll();
                	}
                }
            }
		});
		var localOffset = new Date().getTimezoneOffset();
		localOffset = localOffset/60;
		var offset = '-'+(new Date(new Date().setHours(localOffset, 0, 0, 0)).toTimeString().substr(0,5).trim());
		if (options.mode == 'update'){
			this.opportunityForm.nameTxtFld.setValue(this.record.data.name);
	    	this.opportunityForm.probPickFld.setValue(this.record.data.probability);
	    	this.opportunityForm.reasonWonLostPickFld.setValue(this.record.data.reasonWonLost);
	    	var closeDate = new Date(this.record.data.closeDate);
	    	this.opportunityForm.closeDateDateFld.setValue(closeDate.format('Y-m-d')+'T'+closeDate.format('H:i:s')+offset);
	    	this.opportunityForm.commensTxtAreaFld.setValue(this.record.data.comments);
		}
		this.opportunityForm.show('fade');
	},
	
	showRevenueForm: function(options){
		this.list = options.component;
		this.record = options.record;
		this.mode = options.mode;
		this.opportunityGuid = options.opportunityGuid;
		this.revenueForm = new synchronicity.views.RevenueForm({
			listeners: {
                scope: this,
                hide : function() {
                	if (options.mode == 'update'){
                		options.componentSelModel.view.getSelectionModel().deselectAll();
                	}
                }
            }
		});
		var localOffset = new Date().getTimezoneOffset();
		localOffset = localOffset/60;
		var offset = '-'+(new Date(new Date().setHours(localOffset, 0, 0, 0)).toTimeString().substr(0,5).trim());
		if (options.mode=='update') {
			var startDate = new Date(options.record.get('revenueStartDate'));
			var endDate = new Date(options.record.get('revenueEndDate'));
			this.revenueForm.productPickFld.setValue(options.record.get('productId'));
			this.revenueForm.typePickFld.setValue(options.record.get('revenueType')); 
			this.revenueForm.frequencyPickFld.setValue(options.record.get('revenueInterval'));
			this.revenueForm.startDateFld.setValue(startDate.format('Y-m-d')+'T'+startDate.format('H:i:s')+offset);
			this.revenueForm.endDateFld.setValue(endDate.format('Y-m-d')+'T'+endDate.format('H:i:s')+offset);
			this.revenueForm.unitsFld.setValue(options.record.get('units'));
			this.revenueForm.priceFld.setValue(options.record.get('price'));
		}
		else {
			var startDate = new Date();
			this.revenueForm.startDateFld.setValue(startDate.format('Y-m-d')+'T'+startDate.format('H:i:s')+offset);
			this.revenueForm.endDateFld.setValue(startDate.format('Y')+'-12-31T'+startDate.format('H:i:s')+offset);
		}
		this.revenueForm.show('fade');
	},
	
	
	hideRevenueForm: function(options){
		this.revenueForm.hide();
	},
	
	
	hideOpportunityForm: function(options){
		this.opportunityForm.hide();
	},
	
	
	upsertRecord: function(options){
		var thisController = this;
		var returnObj;
		if (thisController.record != null) {
			thisController.record.set('name', options.newRecord.name);
			thisController.record.set('salesMethod', options.newRecord.salesMethod);
			thisController.record.set('salesStage', options.newRecord.salesStage);
			thisController.record.set('probability', options.newRecord.probability);
			thisController.record.set('closeDate',options.newRecord.closeDate);
			thisController.record.set('reasonWonLost', options.newRecord.reasonWonLost);
			thisController.record.set('comments', options.newRecord.comments);
			thisController.record.save();
			thisController.record.store.sync();
		}
		else {
			var persistentStore = Ext.getStore('synchronicity.stores.persistentOpportunities');
			var persistentAccountStore = Ext.getStore('synchronicity.stores.persistentAccounts');
			var transientStore = Ext.getStore('synchronicity.stores.transientOpportunities');
			persistentStore.filterBy(function(record, id){
				return true;
			});
			var persistentProxy = persistentStore.getProxy();
			var persistentOpportunity = new persistentProxy.model({});
			var nextId = persistentStore.data.length+1;
			var uniqGuid = 'local-'+synchronicity.app.properties.userId+'-'+ nextId;
			persistentOpportunity.data['name'] = options.newRecord.name;
			if (thisController.accountGuid != '') {
				persistentAccountStore.filterBy(function(record){
					return record.get('guid').indexOf(thisController.accountGuid)!=-1;
				});
				if (persistentAccountStore.first()){
					persistentOpportunity.data['accountNumber'] = persistentAccountStore.first().get('number');
					persistentOpportunity.data['accountName'] = persistentAccountStore.first().get('name');
					persistentOpportunity.data['accountGuid'] = thisController.accountGuid;
				}
			}
			
			persistentOpportunity.data['salesMethod'] = options.newRecord.salesMethod;
			persistentOpportunity.data['salesStage'] = options.newRecord.salesStage;
			persistentOpportunity.data['probability'] = options.newRecord.probability;
			persistentOpportunity.data['closeDate'] = options.newRecord.closeDate;
			persistentOpportunity.data['reasonWonLost'] = options.newRecord.reasonWonLost;
			persistentOpportunity.data['comments'] = options.newRecord.comments;
			persistentOpportunity.data['guid'] = uniqGuid;
			var returnObj = persistentStore.add(persistentOpportunity);
			persistentStore.sync();
			transientStore.add(returnObj);
			transientStore.sync();
		}
		if (this.record){
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Opportunity',
	            objectId: thisController.record.get('id'),
	            operation: 'update'
	        });
		}
		else {
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Opportunity',
	            objectId: returnObj[0].get('id'),
	            operation: 'insert'
	        });
		}
		this.hideOpportunityForm();
	},
	
	upsertRevenueRecord: function(options){
		var thisController = this;
		var returnObj;
		var persistentProducts = Ext.getStore('synchronicity.stores.persistentProducts');
		var product;
		persistentProducts.filterBy(function(record){
			if (record.get('guid') == options.newRecord.productId){
				product = record;
			}
			return false;
		});
		var productCode;
		var productName;
		var productId;
		if (product) {
			productCode = product.get('code');
			productName = product.get('name');
			productId = product.get('guid');
		}
		else {
			alert('Invalid product. Pick valid product.');
		}
		if (thisController.record != null) {
			thisController.record.set('productId', productId);
			thisController.record.set('productCode', productCode);
			thisController.record.set('productName', productName);
			thisController.record.set('revenueType', options.newRecord.revenueType);
			thisController.record.set('revenueInterval', options.newRecord.revenueInterval);
			thisController.record.set('revenueStartDate', options.newRecord.revenueStartDate);
			thisController.record.set('revenueEndDate',options.newRecord.revenueEndDate);
			thisController.record.set('units', options.newRecord.units);
			thisController.record.set('price', options.newRecord.price);
			thisController.record.save();
			thisController.record.store.sync();
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Opportunity',
	            objectId: thisController.opportunityGuid,
	            childObjectId: thisController.record.get('id'),
	            operation: 'revenueUpdate',
	            force: true
	        });
		}
		else {
			var persistentStore = Ext.getStore('synchronicity.stores.persistentRevenues');
			var transientRevenues = Ext.getStore('synchronicity.stores.transientRevenues');
			persistentStore.filterBy(function(record){
				return true;
			});
			var persistentProxy = persistentStore.getProxy();
			var persistentRevenue = new persistentProxy.model({});
			var nextId = persistentStore.data.length+1;
			var uniqGuid = 'local-'+synchronicity.app.properties.userId+'-'+ nextId;
			persistentRevenue.data['productId'] = productId;
			persistentRevenue.data['productCode'] = productCode;
			persistentRevenue.data['productName'] = productName;
			persistentRevenue.data['revenueType'] = options.newRecord.revenueType;
			persistentRevenue.data['revenueInterval'] = options.newRecord.revenueInterval;
			persistentRevenue.data['revenueStartDate'] = options.newRecord.revenueStartDate;
			persistentRevenue.data['revenueEndDate'] = options.newRecord.revenueEndDate;
			persistentRevenue.data['units'] = options.newRecord.units;
			persistentRevenue.data['price'] = options.newRecord.price;
			persistentRevenue.data['opportunityGuid'] = thisController.opportunityGuid;
			persistentRevenue.data['revenueClass'] = 'Summary';
			persistentRevenue.data['guid'] = uniqGuid;
			var returnObj = persistentStore.add(persistentRevenue);
			persistentStore.sync();
			var record = persistentStore.getById(returnObj[0].data.id);
			transientRevenues.add(record);
			transientRevenues.sync();
			
			Ext.dispatch({
	            controller: synchronicity.controllers.transaction,
	            action: 'insert',
	            type: 'Opportunity',
	            objectId: thisController.opportunityGuid,
	            childObjectId: record.get('id'),
	            operation: 'revenueAdd',
	            force: true
	        });
		}
		this.revenueForm.hide();
	},
	
	
	deleteRevenueLine: function(options){
		var thisController = this;
		var persistentStore = Ext.getStore('synchronicity.stores.persistentRevenues');
		var transientStore = Ext.getStore('synchronicity.stores.transientRevenues');
		persistentStore.remove(options.record);
		persistentStore.sync();
		transientStore.remove(options.record);
		transientStore.sync();
		Ext.dispatch({
            controller: synchronicity.controllers.transaction,
            action: 'insert',
            type: 'Opportunity',
            objectId: options.opportunityGuid,
            childObjectId: options.record.get('id'),
            operation: 'revenueDelete',
            force: true
        });
	},
	
	
	processServerUpdate: function(options){
		console.log(options.record.data);
		var callback = options.callback;        
        if (typeof callback == 'function') {
            callback.call(options.scope);
        }
	}
});