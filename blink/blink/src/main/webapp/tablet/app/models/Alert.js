Ext.data.ProxyMgr.registerType('synchronicity.models.alertproxy',
		
    Ext.extend(Ext.data.Proxy, {
    	
    	create: function(operation, callback, scope) {
        },
        
        read: function(operation, callback, scope) {
        	var thisProxy = this;
        	Ext.Ajax.request({
    			url: synchronicity.app.properties.baseUrl,
    			timeout: "120000",
    			failure: function (response, opts){
		        	Ext.Ajax.request({
		    			url: synchronicity.app.properties.loginUrl,
		    			timeout: "120000",
		    			method: "POST",
		    			params: {                    
		    				j_username: synchronicity.app.properties.userId,
		    				j_password: synchronicity.app.properties.password
		    			},
		    			success: function (response, opts){
		    			},
		    			failure: function(response, opts) {
		    			}
		    		});
    			},
        		success: function(response, opts) {
        		}
        	});	
        	new Ext.util.DelayedTask(function(){
        	Ext.Ajax.request({
        		url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"Alerts"}}&pageSize=10',
                //callbackKey: 'callback',
	        	//callback: function(results) {
                success: function (response, opts){
                	var results = Ext.util.JSON.decode(response.responseText);
                	if ((results.response.status) && results.response.status == 0 && (results.response.object.components)) {
                		var rows = results.response.object.components;
	        			var alerts = [];
	        			for (var i = 0; (i < operation.limit && i<rows.length); i++) {
	        				var alert = new thisProxy.model({});
	        				var fields = rows[i].fields;
	        				for (var j = 0; j < fields.length; j++) {
	        					var field = fields[j];
	        					alert.data[field.name] = field.value;
	        				}
	        				alerts.push(alert);
	        			}
	        			operation.resultSet = new Ext.data.ResultSet({
	                        records: alerts,
	                        total  : alerts.length,
	                        loaded : true
	                    });
	                    operation.setSuccessful();
	                    operation.setCompleted();
	        		}
	        		if (typeof callback == 'function') {
                        callback.call(scope || this, operation);
                    }
	        	}
        	});
        	}).delay(500);
        },
        
        update: function(operation, callback, scope) {
        },
        
        destroy: function(operation, callback, scope) {
        }
    }
    )
);

Ext.regModel('synchronicity.models.Alert', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'abstract', type: 'string'},
	         {name: 'message', type: 'string'}
	         ],
	         
	proxy: {type: 'synchronicity.models.alertproxy',
			  id: 'blink-alert'}
});