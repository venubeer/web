synchronicity.views.OpportunityForm = Ext.extend(Ext.Panel, {
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
    	var methodStore = [{text:"",value:""}];
		var probStore = [{text:"",value:""}];
		var reasonData = [];
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'REASON_WON_LOST', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {reasonData[reasonData.length] = {text: record.get('value'), 
																			  value: record.get('value'),
																			  parentValue: record.get('parentValue')};});
		Ext.regModel('ReasonOptions', {fields: ['text','value','parentValue']});
		this.reasonStore = new Ext.data.Store({
		    model  : 'ReasonOptions', data: reasonData, id: 'reasonStore',
		    proxy: {type: 'memory', reader: {type: 'json'}}
		});		
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'SALES_METHOD', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {methodStore[methodStore.length] = {text: record.get('value'), value: record.get('name')};});
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'PROB', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {probStore[probStore.length] = {text: record.get('value'), value: record.get('name')};});
		this.stageStore = Ext.getStore('synchronicity.stores.persistentListOfValues');
		this.stageStore.clearFilter(true);
			
		
		this.nameTxtFld = new Ext.form.Text({label: 'Name', required: true, maxLength: 100});
    	this.probPickFld = new Ext.form.Select({label: 'Probability', required: true, options: probStore});
    	this.reasonWonLostPickFld = new Ext.form.Select({label: 'Reason Won/Lost', store: this.reasonStore});
    	this.reasonStore.filter([{property: 'parentValue', value: this.salesStage, exactMatch: true, anyMatch: true}]);	
    	this.reasonStore.sync();
    	this.stagePickFld = new Ext.form.Select({label: 'Sales Stage', required: true, displayField: 'value', valueField: 'value', store: this.stageStore,
										    		listeners:{
											 			change: function(picklist, value) {
											 				var selectedValue='';
											 				picklist.store.each(function(record){
											 														if (record.get('value')==value){
											 															selectedValue = record.get('name');
											 															return
											 														}
											 													}
											 				);
											 				var array = selectedValue.toString().split(',');
											 				thisForm.probPickFld.setValue(array[1]);
											 				thisForm.reasonWonLostPickFld.setValue('');
											 				thisForm.reasonStore.clearFilter(true);
											 				thisForm.reasonStore.load();
											 				thisForm.reasonStore.filter([{property: 'parentValue', value: array[2], exactMatch: true, anyMatch: true}
											 				                           ]);
											 				thisForm.reasonStore.sync();
											 			}
										    		}
    											});
    	this.stageStore.filter([{property: 'type', value: 'SALES_STAGE', exactMatch: true, anyMatch: true},
		                        {property: 'parentValue', value: this.salesMethod, exactMatch: true, anyMatch: true}
         						]);	
    	thisForm.stageStore.sync();
    	this.stagePickFld.setValue(this.salesStage);
    	this.methodPickFld = new Ext.form.Select({label: 'Sales Method', required: true, value: this.salesMethod, options: methodStore,
										    		listeners:{
											 			change: function(picklist, value) {
											 				thisForm.stageStore.clearFilter(true);
											 				thisForm.stageStore.load();
											 				thisForm.stageStore.filter([{property: 'type', value: 'SALES_STAGE', exactMatch: true, anyMatch: true},
											 				                            {property: 'parentValue', value: value, exactMatch: true, anyMatch: true}
											 				                           ]);
											 				thisForm.stageStore.sync();
											 				thisForm.stagePickFld.setValue(' ');
											 				thisForm.probPickFld.setValue(' ');
											 				thisForm.reasonWonLostPickFld.setValue(' ');
											 			 }
										    		}
    											});
    	this.closeDateDateFld = new Ext.ux.form.DateTimePicker({label: 'Close Date', required: true, modal: true});
    	this.commensTxtAreaFld = new Ext.form.TextArea({label: 'Comments', maxLength: 250});
    	this.items = [{xtype: 'form',
			           items: [{
				                xtype: 'fieldset',
				                defaults: {
				                    labelWidth: '40%'
				                },
				                items: [this.nameTxtFld, 
				                        this.methodPickFld, 
				                        this.stagePickFld,
				                        this.probPickFld,
				                        this.closeDateDateFld,
				                        this.reasonWonLostPickFld,
				                        this.commensTxtAreaFld
						            	]
			            		}]
			        }];   
    	
    	this.dockedItems = [{dock: 'top',
	        xtype: 'toolbar',
	        title: 'Opportunity Form',
	        items: [{xtype: 'button', 
			   		 ui: 'decline',
			         text: 'Cancel',
			         handler: function(cmp) {
			                	 Ext.dispatch({
			                         controller: synchronicity.controllers.opportunity,
			                         action: 'hideOpportunityForm'
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
		                	 		 var closeDate='';
		                	 		 if (thisForm.closeDateDateFld.getValue() != null && thisForm.closeDateDateFld.getValue() != ''){
		                	 			closeDate = new Date(thisForm.closeDateDateFld.getValue());
		                	 		 }
		                	 		 if (thisForm.stagePickFld.getValue().toUpperCase().indexOf('LOST') != -1 && 
		                	 				(thisForm.reasonWonLostPickFld.getValue()==null || thisForm.reasonWonLostPickFld.getValue() == '')){
		                	 			 alert('Reason Won/Lost is required when opportunity stage is set to Lost.');
		                	 			 validations=false;
		                	 		 }
		                	 		 if (validations){
					                	 Ext.dispatch({
					                         controller: synchronicity.controllers.opportunity,
					                         action: 'upsertRecord',
					                         newRecord: {'name': thisForm.nameTxtFld.getValue(),
					                        	 		 'salesMethod': thisForm.methodPickFld.getValue(),
					                        	 		 'salesStage':thisForm.stagePickFld.getValue(),
					                        	 		 'probability': thisForm.probPickFld.getValue(),
					                        	 		 'closeDate': closeDate.format('m/d/Y'),
					                        	 		 'reasonWonLost': thisForm.reasonWonLostPickFld.getValue(),
					                        	 		 'comments': thisForm.commensTxtAreaFld.getValue()
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
    	synchronicity.views.OpportunityForm.superclass.initComponent.call(this);
    }

});