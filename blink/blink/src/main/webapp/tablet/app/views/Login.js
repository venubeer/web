synchronicity.views.Login = Ext.extend(Ext.Panel,{
	fullscreen: true,
	dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        title: 'Login'
    }],
	items: [{
		title: 'Basic',
	    xtype: 'form',
	    id: 'loginForm',
	    scroll: 'vertical',
	    items: [{
	    		xtype: 'spacer'
	    		}, {
	            xtype: 'fieldset',
	            title: '',
	            defaults: {
	                labelWidth: '35%'
	            },
	            items: [{
	                xtype: 'textfield',
	                name: 'userId',
	                id: 'userId',
	                label: 'User Id',
	                placeHolder: 'Windows User Id',
	                required: true,
	                useClearIcon: true,
	                autoCapitalize : false
	            	}, {
	                xtype: 'passwordfield',
	                name: 'password',
	                id: 'password',
	                label: 'Password',
	                placeHolder: 'Windows Password',
	                required: true,
	                useClearIcon: true
	            	}
	            	] 
	    		},{
	    		xtype: 'button', 
	    		id: 'login',
	    		text: 'Login',
	    		handler: 
	    			function() {
	    				if (Ext.ComponentMgr.get('userId').getValue() == ''){
	    					if (!this.nullUser) {
								this.nullUser = new synchronicity.views.AlertPop({html: 'User Id is required.',
																					invoke: function(val) {}
																					});
							}
							this.nullUser.show();
	    					return;
	    				}
	    				if (Ext.ComponentMgr.get('password').getValue() == ''){
	    					if (!this.nullPassword) {
								this.nullPassword = new synchronicity.views.AlertPop({html: 'Password is required.',
																					invoke: function(val) {}
																					});
							}
	    					this.nullPassword.show();
							return;
	    				}
	    				Ext.ComponentMgr.get('userId').blur()
	    				Ext.ComponentMgr.get('password').blur();
	    				Ext.dispatch({
		                    controller: synchronicity.controllers.login,
		                    action: 'authenticate',
		                    userId: Ext.ComponentMgr.get('userId').getValue(),
		                    password: Ext.ComponentMgr.get('password').getValue()
		                });
	    			}
	    		},
	    		{
	    			cls: 'launchscreen',
	    			html: Ext.is.Phone?'':'<img src="resources/images/synchronicity.png" height="291" /><p>Version 0.9 Beta</p>'
	    		}]
		}
    ],
    initComponent: function() {
    	synchronicity.views.Login.superclass.initComponent.apply(this,arguments);
    },
	
	autoAuthenticate: function() {
    	var store = Ext.getStore('synchronicity.stores.settings');
        var first = store.first();
        if (first) {
        	var userId = first.get('userId');
        	var password = first.get('password');
        	var loggedOut = first.get('loggedOut');
        	if (loggedOut == 'false' && userId != '' && password != '' && synchronicity.app.properties.autoAuthenticate){
        		Ext.dispatch({
                    controller: synchronicity.controllers.login,
                    action: 'authenticate',
                    userId: userId,
                    password: password
                });
        	}
        	Ext.ComponentMgr.get('userId').setValue(userId);
        }
        else {
        	Ext.getBody().unmask();
        }
    }
});