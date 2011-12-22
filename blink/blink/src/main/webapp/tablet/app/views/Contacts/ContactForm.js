synchronicity.views.ContactForm = Ext.extend(Ext.Panel, {
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
    	var thisComponent = this;
    	var picklistStore = Ext.getStore('synchronicity.stores.persistentListOfValues');
    	var stateStore = [{text:"",value:""}];
		var departmentStore = [{text:"",value:""}];
		var titleStore = [{text:"",value:""}];
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'BAX_CONTACT_DEPT', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {departmentStore[departmentStore.length] = {text: record.get('value'), value: record.get('name')};});
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'BAX_CONTACT_JOB_TITLE', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {titleStore[titleStore.length] = {text: record.get('value'), value: record.get('name')};});
		picklistStore.clearFilter(true);
		picklistStore.load();
		picklistStore.filter({property: 'type', value: 'STATE_ABBREV', exactMatch: true, anyMatch: true});
		picklistStore.each(function(record) {stateStore[stateStore.length] = {text: record.get('value'), value: record.get('name')};});
		
    	this.firstNameTxtFld = new Ext.form.Text({label: 'First Name', required: true, maxLength: 50});
    	this.lastNameTxtFld = new Ext.form.Text({label: 'Last Name', required: true, maxLength: 50});
    	this.addressLine1TxtFld = new Ext.form.Text({label: 'Address 1', maxLength: 200});
    	this.addressLine2TxtFld = new Ext.form.Text({label: 'Address 2', maxLenght: 100});
    	this.cityTxtFld = new Ext.form.Text({label: 'City', maxLength: 50});
    	this.statePickFld = new Ext.form.Select({label: 'State', options: stateStore});
    	this.postalCodeTxtFld = new Ext.form.Text({label: 'Zip code', maxLength: 12});
    	this.departmentPickFld = new Ext.form.Select({label: 'Department', required: true, options: departmentStore});
    	this.titlePickFld = new Ext.form.Select({label: 'Title', required: true, options: titleStore});
    	this.workPhNumTxtFld = new Ext.ux.form.Telephone({label: 'Work Phone #', required: true, maxLength: 16});
    	this.cellPhNumTxtFld = new Ext.ux.form.Telephone({label: 'Cell Phone #', maxLength: 10});
    	this.emailTxtFld = new Ext.form.Email({label: 'Email', maxLength: 50});
    	this.items = [{xtype: 'form',
			           items: [{
				                xtype: 'fieldset',
				                defaults: {
				                    labelWidth: '35%'
				                },
				                items: [this.firstNameTxtFld, 
				                        this.lastNameTxtFld, 
				                        this.departmentPickFld,
				                        this.titlePickFld,
				                        this.workPhNumTxtFld,
				                        this.cellPhNumTxtFld,
				                        this.emailTxtFld,
				                        this.addressLine1TxtFld,
						            	this.addressLine2TxtFld,
						            	this.cityTxtFld,
						            	this.statePickFld,
						            	this.postalCodeTxtFld
						            	]
			            		}]
			        }];   
    	this.dockedItems = [{
						    	dock: 'top',
						        xtype: 'toolbar',
						        title: 'Contact Form',
						        items: [{xtype: 'button', 
								   		 ui: 'decline',
								         text: 'Cancel',
								         handler: function(cmp) {
								                	 Ext.dispatch({
								                         controller: synchronicity.controllers.contact,
								                         action: 'hideContactForm'
								                     });
								         		}
								        },
								        {xtype: 'spacer', flex: 1},
						                {xtype: 'button', 
						        		 ui: 'action',
						                 text: 'Done',
						                 handler: function(cmp) {
								                	 var validations = true;
						                	 		 thisComponent.items.first().items.first().items.each(function(item){
						                	 			 if (!item.hidden && item.required && (item.getValue()== null ||item.getValue().length == 0)){
						                	 				 validations = false;
						                	 			 }
						                	 		 });
						                	 		 var workPhNum;
						                	 		 var cellPhNum;
						                	 		 if (validations){
						                	 			 if ((thisComponent.addressLine1TxtFld.getValue().length != 0 ||
						                	 					thisComponent.addressLine2TxtFld.getValue().length != 0||
						                	 					thisComponent.cityTxtFld.getValue().length != 0||
						                	 					thisComponent.statePickFld.getValue().length != 0||
						                	 					thisComponent.postalCodeTxtFld.getValue() != 0) &&
						                	 					(thisComponent.addressLine1TxtFld.getValue().length == 0 ||
						                	 					thisComponent.cityTxtFld.getValue().length == 0||
						                	 					thisComponent.statePickFld.getValue().length == 0||
						                	 					thisComponent.postalCodeTxtFld.getValue() == 0)) {
						                	 				alert('Address is incomplete. Address Line 1, City, State, Zip Code are required for a complete address.');
						                	 				return;
						                	 			 }
						                	 			 workPhNum = thisComponent.workPhNumTxtFld.getValue().replace(/[^a-zA-Z0-9]+/g,'');
						                	 			 if (workPhNum.length < 10) {
						                	 				 alert('Work Phone # has to be atleast 10 alphanumeric characters of length. Enter a valid Work Phone #');
						                	 				 return;
						                	 			 }
						                	 			 cellPhNum = thisComponent.cellPhNumTxtFld.getValue().replace(/[^0-9]+/g,'');
						                	 			 if (cellPhNum!='' && cellPhNum.length < 10) {
						                	 				 alert('Cell Phone # has to be 10 numeric characters of length. Enter a valid Cell Phone #');
						                	 				 return;
						                	 			 }
						                	 			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						                	 			if (thisComponent.emailTxtFld.getValue().length != 0 &&
						                	 					!re.test(thisComponent.emailTxtFld.getValue())) {
						                	 				alert('Invalid email. Enter a valid email');
						                	 				return;
						                	 			}
						                	 		 }
						                	 		 if (validations) {
							                	 		 Ext.dispatch({
									                         controller: synchronicity.controllers.contact,
									                         action: 'upsertRecord',
									                         newRecord: {
									                        	 "firstName": thisComponent.firstNameTxtFld.getValue(), 
											                     "lastName": thisComponent.lastNameTxtFld.getValue(), 
											                     "department": thisComponent.departmentPickFld.getValue(),
											                     "title": thisComponent.titlePickFld.getValue(),
											                     "workPhone": thisComponent.workPhNumTxtFld.getValue(),
											                     "cellPhone": thisComponent.cellPhNumTxtFld.getValue(),
											                     "email": thisComponent.emailTxtFld.getValue(),
											                     "addressLine1": thisComponent.addressLine1TxtFld.getValue(),
											                     "addressLine2": thisComponent.addressLine2TxtFld.getValue(),
											                     "city": thisComponent.cityTxtFld.getValue(),
											                     "state": thisComponent.statePickFld.getValue(),
											                     "zipcode": thisComponent.postalCodeTxtFld.getValue()
									                         }
									                     });
						                	 		 }
						                	 		 else {
						                	 			alert('Enter values for all required columns.');
						                	 		 }
						                 		}
						                 }
						               ]
						    }];
    	synchronicity.views.ContactForm.superclass.initComponent.call(this);
    }

});