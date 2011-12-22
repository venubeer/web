synchronicity.views.ConfirmPop = Ext.extend(Ext.Panel, {
													id: 'confirmBox',
								                    floating: true,
								                    modal: true,
								                    centered: true,
								                    width: 400,
								                    height: 170,
								                    styleHtmlContent: true,
								                    scroll: 'vertical',
								                    html: '',
								                    hideOnMaskTap: false,
								                    dockedItems: [
								                    {
								                    	dock: 'bottom',
								                        xtype: 'toolbar',
								                        title: '',
								                        items: [
								                                {xtype: 'spacer', flex: 1},
								                                {xtype: 'spacer', flex: 1},
								                                {xtype: 'button',  
								                                 text: ' Yes ',
								                                 handler: function() {
								                                	 var panel = Ext.ComponentMgr.get('confirmBox');
								                                	 panel.hide();
								                                	 if (panel.invoke) {
								                                		 panel.invoke('0');
								                                	 }
								                                 }
								                                },
								                                {xtype: 'spacer', flex: 1},
								                                {xtype: 'button',  
								                                 text: ' No ',
								                                 handler: function() {
								                                	 var panel = Ext.ComponentMgr.get('confirmBox');
								                                	 panel.hide();
								                                	 if (panel.invoke) {
								                                		 panel.invoke('1');
								                                	 }
								                                 }
								                                },
								                                {xtype: 'spacer', flex: 1},
								                                {xtype: 'spacer', flex: 1}
								                               ]
								                    }],
								                    invoke: function(val){}
								                });

synchronicity.views.AlertPop = Ext.extend(Ext.Panel, {
											id: 'alertBox',
										    floating: true,
										    modal: true,
										    centered: true,
										    width: 400,
										    height: 170,
										    styleHtmlContent: true,
										    scroll: 'vertical',
										    html: '',
										    hideOnMaskTap: false,
										    dockedItems: [
										    {
										    	dock: 'bottom',
										        xtype: 'toolbar',
										        title: '',
										        items: [{xtype: 'spacer', flex: 1},
										                {xtype: 'button',  
										                 text: '    Ok    ',
										                 handler: function() {
										                	 var panel = Ext.ComponentMgr.get('alertBox');
										                	 panel.hide();
										                	 if (panel.invoke) {
										                		 panel.invoke('0');
										                	 }
										                 }
										                },
										                {xtype: 'spacer', flex: 1}
										               ]
										    }],
										    invoke: function(val){}
										});

synchronicity.views.SearchPop = Ext.extend(Ext.Panel, {
											id: 'searchBox',
										    floating: true,
										    modal: true,
										    width: 300,
										    height: 55,
										    scroll: false,
										    hideOnMaskTap: true,
										    dockedItems: [{xtype: 'toolbar', dock: 'top', ui: 'light',
										    			   items: [{xtype: 'searchfield',
										    				        placeHolder: 'Search', 
										    				        name: 'searchfield', 
										    				        id: 'searchfield',
										    				        autoCapitalize : false,
									    				        	listeners: {
									    				        		keyup: function(e, text){ 
									    				        				if (text.browserEvent.keyCode == 13) {
									    				        					this.blur();
									    				        					var panel = Ext.ComponentMgr.get('searchBox');
									    				        					panel.hide();
																                	if (panel.invoke) {
																                		panel.invoke(this.getValue());
																                	}
																                	this.setValue('');
									    				        				}
									    				        		}
									    				        	}}]}],
			    				        	layoutOrientation : function(orientation, w, h) {
			    				        		this.hide();
			    				        		synchronicity.views.SearchPop.superclass.layoutOrientation.call(this, orientation, w, h);
			    				        	},
										    invoke: function(val){}
										});