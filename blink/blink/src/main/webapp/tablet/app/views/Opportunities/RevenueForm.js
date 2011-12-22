synchronicity.views.RevenueForm = Ext.extend(Ext.Panel, {
	floating: true,
    modal: true,
    centered: true,
    scroll: 'vertical',
    hideOnMaskTap: false,
    width: 450,
    height: 550,
    dockedItems: [],

    items: [],
    
    initComponent: function() {
    	var thisForm = this;
    	var picklistStore = Ext.getStore('synchronicity.stores.persistentListOfValues');
    	var revenueTypeStore = [{text:"",value:""}];
		var revenueFreqStore = [{text:"",value:""}];
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'REVENUE_TYPE', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {revenueTypeStore[revenueTypeStore.length] = {text: record.get('value'), value: record.get('name')};});
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'BAX_OPTY_REV_INTERVAL', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {revenueFreqStore[revenueFreqStore.length] = {text: record.get('value'), value: record.get('name')};});
		var productStore = Ext.getStore('synchronicity.stores.persistentProducts');
		productStore.filterBy(function(record){
			if (record.get('salesFlag') == 'Y'){
				return true;
			}
			return false;
		});
		
		this.productPickFld = new Ext.form.Select({label: 'Product', required: true, displayField: 'product', valueField: 'guid', store: productStore});
    	this.typePickFld = new Ext.form.Select({label: 'Type', required: true, options: revenueTypeStore});
    	this.frequencyPickFld = new Ext.form.Select({label: 'Frequency', required: true, options: revenueFreqStore});
    	this.startDateFld = new Ext.ux.form.DateTimePicker({label: 'Start Date', required: true, modal: true});
    	this.endDateFld = new Ext.ux.form.DateTimePicker({label: 'End Date', required: true, modal: true});
    	this.unitsFld = new Ext.form.Number({label: 'Units', required: true, maxLength: 18});
    	this.priceFld = new Ext.form.Number({label: 'Price', required: true, maxLength: 18});
    	
    	this.items = [{xtype: 'form',
			           items: [{
				                xtype: 'fieldset',
				                defaults: {
				                    labelWidth: '40%'
				                },
				                items: [this.productPickFld, 
				                        this.typePickFld, 
				                        this.frequencyPickFld,
				                        this.startDateFld,
				                        this.endDateFld,
				                        this.unitsFld,
				                        this.priceFld
						            	]
			            		}]
			        }];   
    	
    	this.dockedItems = [{dock: 'top',
	        xtype: 'toolbar',
	        title: 'Revenue Form',
	        items: [{xtype: 'button', 
			   		 ui: 'decline',
			         text: 'Cancel',
			         handler: function(cmp) {
			                	 Ext.dispatch({
			                         controller: synchronicity.controllers.opportunity,
			                         action: 'hideRevenueForm'
			                     });
			         		}
			        },
			        {xtype: 'spacer', flex: 1},
	                {xtype: 'button', 
	        		 ui: 'action',
	                 text: 'Done',
	                 handler: function(cmp) {
	                	 		 var validations = true;
	                	 		 thisForm.items.first().items.first().items.each(function(item){
	                	 			 if (!item.hidden && item.required && (item.getValue()== null ||item.getValue().length == 0)){
	                	 				 validations = false;
	                	 			 }
	                	 		 });
	                	 		 if (validations) {
	                	 			 var startDay='';
		                	 		 var endDay='';
		                	 		 if (thisForm.startDateFld.getValue() != null && thisForm.endDateFld.getValue() !=null 
		                	 				 && thisForm.startDateFld.getValue() != '' 
		                	 				 && thisForm.endDateFld.getValue() != '') {
		                	 			startDay = new Date(thisForm.startDateFld.getValue());
		                	 			endDay = new Date(thisForm.endDateFld.getValue());
		                	 			if (startDay >= endDay) {
		                	 				alert ('Start Date should be less than End Date.');
		                	 				validations = false;
		                	 			}
		                	 		 }
		                	 		 if (validations){
					                	 Ext.dispatch({
					                         controller: synchronicity.controllers.opportunity,
					                         action: 'upsertRevenueRecord',
					                         newRecord: {'productId': thisForm.productPickFld.getValue(), 
								                         'revenueType': thisForm.typePickFld.getValue(), 
								                         'revenueInterval': thisForm.frequencyPickFld.getValue(),
								                         'revenueStartDate': (new Date(thisForm.startDateFld.getValue())).format('m/d/Y'),
								                         'revenueEndDate': (new Date(thisForm.endDateFld.getValue())).format('m/d/Y'),
								                         'units': thisForm.unitsFld.getValue(),
								                         'price': thisForm.priceFld.getValue()
					                        	 		}
					                     });
		                	 		 }
	                	 		 }
	                	 		 else {
	                	 			alert('Enter values for all required columns.');
	                	 		 }
	                 		}
	                 }
	              ]
		    }];
    	synchronicity.views.RevenueForm.superclass.initComponent.call(this);
    }

});