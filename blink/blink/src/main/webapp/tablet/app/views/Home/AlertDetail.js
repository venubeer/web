synchronicity.views.AlertDetail = Ext.extend(Ext.Panel, {
	floating: true,
    modal: true,
    centered: true,
    scroll: 'vertical',
    hideOnMaskTap: false,
    width: 350,
    height: 550,
    dockedItems: [
    {
    	dock: 'top',
        xtype: 'toolbar',
        title: 'Alert Detail',
        items: [{xtype: 'spacer', flex: 1},
                {xtype: 'button', 
        		 ui: 'action',
                 text: 'Done',
                 handler: function(cmp) {
		                	 Ext.dispatch({
		                         controller: synchronicity.controllers.home,
		                         action: 'hideAlertDetail'
		                     });
                 		}
                 }
               ]
    }],

    items: [],
    
    initComponent: function() {
    	this.abstractLabelTxtFld = new Ext.form.Text({label: 'Abstract', labelWidth: '99%'});
    	this.abstractLabelTxtFld.disable();
    	this.abstractTxtAreaFld = new Ext.form.TextArea({maxRows: 5});
    	this.abstractTxtAreaFld.disable();
    	this.messageLabelTxtFld = new Ext.form.Text({label: 'Message', labelWidth: '99%'});
    	this.messageLabelTxtFld.disable();
    	this.messageTxtAreaFld = new Ext.form.TextArea({maxRows: 50});
    	this.messageTxtAreaFld.disable();
    	this.items = [{xtype: 'form',
			           items: [{
			                xtype: 'fieldset',
			                items: [this.abstractLabelTxtFld, this.abstractTxtAreaFld, this.messageLabelTxtFld, this.messageTxtAreaFld]
			            }]
			        }	];   
    	synchronicity.views.AlertDetail.superclass.initComponent.call(this);
    }

});