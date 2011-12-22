synchronicity.views.AccountForm = Ext.extend(Ext.Panel, {
	floating: true,
    modal: true,
    centered: true,
    scroll: 'vertical',
    hideOnMaskTap: false,
    width: 350,
    height: 400,
    dockedItems: [
    {
    	dock: 'top',
        xtype: 'toolbar',
        title: 'Account Form',
        items: [{xtype: 'spacer', flex: 1},
                {xtype: 'button', 
        		 ui: 'action',
                 text: 'Done',
                 handler: function(cmp) {
		                	 Ext.dispatch({
		                         controller: synchronicity.controllers.account,
		                         action: 'hideAccountForm'
		                     });
                 		}
                 }
               ]
    }],

    items: [],
    
    initComponent: function() {
    	this.accountNumberTxtFld = new Ext.form.Text({label: 'Number', disabled: true});
    	this.accountNameTxtFld = new Ext.form.Text({label: 'Name', disabled: true});
    	this.addressTxtAreaFld = new Ext.form.TextArea({label: 'Address', disabled: true});
    	this.focusAccountFld = new Ext.form.Hidden();
    	this.markFocusAccount = new Ext.Button({
            text: 'Mark as Focus Account',
            ui: 'confirm',
            scope: this,
            handler: function(){
            	Ext.dispatch({
                    controller: synchronicity.controllers.account,
                    action: 'updateRecord',
                    focusAccount: 'Y'
                });
            	this.markFocusAccount.hide(false);
            	this.markNotFocusAccount.show(false);
            }
        });
    	this.markNotFocusAccount = new Ext.Button({
            text: 'Mark as Not Focus Account',
            ui: 'confirm',
            scope: this,
            handler: function(){
            	Ext.dispatch({
                    controller: synchronicity.controllers.account,
                    action: 'updateRecord',
                    focusAccount: 'N'
                });
            	this.markNotFocusAccount.hide(false);
            	this.markFocusAccount.show(false);
            }
        });
    	this.items = [{xtype: 'form',
			           items: [{
				                xtype: 'fieldset',
				                items: [this.accountNumberTxtFld, 
				                        this.accountNameTxtFld, 
				                        this.addressTxtAreaFld]
			            		},
			            		{
				                xtype: 'fieldset',
				                items: [this.markFocusAccount, 
				                        {xtype: 'spacer'},
				                        this.markNotFocusAccount]
				            	}]
			        }];   
    	synchronicity.views.AccountForm.superclass.initComponent.call(this);
    }

});