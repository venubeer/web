synchronicity.controllers.login = new Ext.Controller({
	
	logout: function(options){		
		Ext.Ajax.request({
			url: synchronicity.app.properties.logoffUrl,
			timeout: "10000",
			success: function (response, opts){
			},
			failure: function(response, opts){
			}
		});
		
		Ext.Ajax.request({
			url: synchronicity.app.properties.baseUrl,
			timeout: "10000",
			success: function (response, opts){
			},
			failure: function(response, opts){
			}
		});		
		var store = Ext.getStore('synchronicity.stores.settings');
		var first = store.first();
		if (first) {
			first.set('loggedOut','true');
			store.sync();
		}
		window.location = 'index.html';
	},
	
	authenticate: function(options) {
		Ext.getBody().mask('<div class="demos-loading">Preparing...</div>');
		var thisController = this;
		Ext.Ajax.request({
			url: synchronicity.app.properties.loginUrl,
			timeout: "10000",
			method: "POST",
			params: {                    
				j_username: options.userId,
				j_password: options.password
			},
			success: function (response, opts){
			},
			failure: function(response, opts) {
			}
		});
		Ext.Ajax.request({
			url: synchronicity.app.properties.baseUrl,
			timeout: "10000",
			success: function (response, opts){
				thisController.getCurrentUser(options);
				//thisController.authenticateLocally(options);
				//Ext.getBody().unmask();
			},
			failure: function(response, opts){
				var division, position, positionType;
				Ext.Ajax.request({
					url: synchronicity.app.properties.loginUrl,
					timeout: "10000",
					method: "POST",
					params: {                    
						j_username: options.userId,
						j_password: options.password
					},
					success: function (response, opts){
						thisController.getCurrentUser(options);
						//thisController.authenticateLocally(options);
						//Ext.getBody().unmask();
					},
					failure: function(response, opts) {
						thisController.authenticateLocally(options);
						Ext.getBody().unmask();
					}
				});
			}
		});
	},
	
	getCurrentUser: function(options) {
		Ext.Ajax.request({
			url: synchronicity.app.properties.baseSiebelDataUrl+'query.json?request={"config":{"name":"CurrentUser"}}',
			timeout: "20000",
			success: function (response, opts){
				var results = Ext.util.JSON.decode(response.responseText);
				if ((results.response.status) && results.response.status == 0) {
					var fields = results.response.object.components[0].fields;
					var position, division, initialized;
					for (var i = 0; (i < fields.length); i++) {
						if (fields[i].name == "division") {
							division = fields[i].value;
						}
						if (fields[i].name == "position") {
							position = fields[i].value;
						}
						if (fields[i].name == "positionType") {
							positionType = fields[i].value;
						}
					}
					synchronicity.app.properties.userId=options.userId;
					synchronicity.app.properties.position=position;
					synchronicity.app.properties.division=division;
					synchronicity.app.properties.password=options.password;
					var store = Ext.getStore('synchronicity.stores.settings');
					var first = store.first();
					if (first) {
						if (first.get('userId')!=options.userId ||first.get('position')!=position||first.get('division')!=division){
							Ext.getBody().unmask();
							this.currentUserError = new synchronicity.views.AlertPop({html: 'Local database on device already initialized for '+first.get('userId')+'('+first.get('division')+'/'+first.get('position')+'). Please wipe out local database using device Settings, to reinitialize local database.',
																					invoke: function(val) {}
																					});
							this.currentUserError.show();
						}
						else {
							first.set('userId',options.userId);
							first.set('password',options.password);
							first.set('loggedOut','false');
							first.set('userType',positionType);
							first.set('userTitle',positionType+' - '+division+'/'+position);
							first.set('userOrganization', 'US Medication Delivery');
							first.set('lastLoggedIn', new Date());
							first.set('position', position);
							first.set('division', division);
							initialized=true;
						}
					}
					else {
						store.add({userId: options.userId,
			        			   password: options.password,
			        			   loggedOut: 'false',
			        			   userType: positionType,
			        			   userTitle: positionType+' - '+division+'/'+position,
			        			   userOrganization: 'US Medication Delivery',
			        			   lastLoggedIn: new Date(),
			        			   position: position,
			        			   division: division
			        			}
			        	);
						initialized=true;
			        }
					if (initialized==true){
						store.sync();
						if (positionType=='Sales Territory Manager') {
							synchronicity.app.properties.offline='true';
						}
						else {
							synchronicity.app.properties.offline='false';
						}		
						Ext.getBody().unmask();
						synchronicity.views.viewport.setActiveItem(synchronicity.views.main, 'fade');
					}
				}
				else {
					Ext.getBody().unmask();
					this.currentUserError = new synchronicity.views.AlertPop({html: 'Error getting user information. '+results.response.error,
																			invoke: function(val) {}
																			});
					this.currentUserError.show();
				}
			},
			failure: function(response, opts) {
				Ext.getBody().unmask();
				this.currentUserError = new synchronicity.views.AlertPop({html: 'Error getting user information. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.',
																		invoke: function(val) {}
																		});
				this.currentUserError.show();
			}
		});
	},
	
	authenticateLocally: function(options) {
		var store = Ext.getStore('synchronicity.stores.settings');
		var first = store.first();
		if (first) {
			if (options.userId == first.data.userId && options.password == first.data.password) {
				first.set('lastLoggedIn', new Date());
				first.set('loggedOut', 'false');
		        store.sync();
		        var positionType = first.get('userType');
		        var userId = first.get('userId');
		        var position = first.get('position');
		        var division = first.get('division');
		        if (positionType=='Sales Territory Manager') {
					synchronicity.app.properties.offline='true';
				}
				else {
					synchronicity.app.properties.offline='false';
				}
		        synchronicity.app.properties.userId=userId;
				synchronicity.app.properties.position=position;
				synchronicity.app.properties.division=division;
				synchronicity.app.properties.password=options.password;
				synchronicity.views.viewport.setActiveItem(synchronicity.views.main, 'fade');
			}
			else {
				this.serverNotReachable = new synchronicity.views.AlertPop({html: 'Error authenticating. Please provide a valid Username/Password.',
																invoke: function(val) {}
																});
				this.serverNotReachable.show();
			}						
		}
		else {
			this.serverNotReachable = new synchronicity.views.AlertPop({html: 'Error authenticating. Local database not initialized and Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.',
															invoke: function(val) {}
															});
			this.serverNotReachable.show();
		}	
	},
	
	
	checkServerAuthenticate: function(options) {
		var store = Ext.getStore('synchronicity.stores.settings');
        var first = store.first();
        if (first) {
        	var userId = first.get('userId');
        	var password = first.get('password');
        	Ext.Ajax.request({
    			url: synchronicity.app.properties.loginUrl,
    			timeout: "120000",
    			method: "POST",
    			params: {                    
    				j_username: userId,
    				j_password: password
    			},
    			success: function (response, opts){
    			},
    			failure: function(response, opts) {
    			}
    		});
        	new Ext.util.DelayedTask(function(){
			Ext.Ajax.request({
				url: synchronicity.app.properties.baseUrl,
				timeout: "120000",
				success: function (response, opts){
					var callback = options.callback;        
			        if (typeof callback == 'function') {
			            callback.call(options.scope);
			        }
				},
				failure: function(response, opts) {
					Ext.Ajax.request({
		    			url: synchronicity.app.properties.loginUrl,
		    			timeout: "120000",
		    			method: "POST",
		    			params: {                    
		    				j_username: userId,
		    				j_password: password
		    			},
		    			success: function (response, opts){
		    				var callback = options.callback;        
					        if (typeof callback == 'function') {
					            callback.call(options.scope);
					        }
		    			},
		    			failure: function(response, opts) {
							this.serverNotReachable = new synchronicity.views.AlertPop({html: 'Error authenticating. Server cannot be reached. Make sure you have access to the Internet and VPNed into Baxter network.',
																			invoke: function(val) {}
																			});
							this.serverNotReachable.show();
		    			}
					});
				}
			});}).delay(500);
        }
        else {
        	this.dbNotInitialized = new synchronicity.views.AlertPop({html: 'Error authenticating. Local setting database not initialized.',
															invoke: function(val) {}
															});
			this.dbNotInitialized.show();
        }
	}
});