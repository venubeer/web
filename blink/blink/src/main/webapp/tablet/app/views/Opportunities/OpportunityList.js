synchronicity.views.OpportunityList = Ext
		.extend(
				Ext.form.FormPanel,
				{
					id : 'synchronicity.views.opportunityList',
					scroll : 'vertical',
					fullscreen : true,
					items : [],
					initComponent : function() {
						this.list = new Ext.List(
								{
									itemTpl : new Ext.XTemplate(
											'<div>',
											'<div class="list-item-title"> {name}',
											'</div>',
											'<div class="list-item-narrative">',
											'Account:&nbsp; {accountNumber}&nbsp;-&nbsp;{accountName}',
											'</div>',
											'<div class="list-item-narrative">',
											'<tpl if="this.isNull(primaryContact) == false">',
											'Primary Contact:&nbsp;{primaryContact}',
											'</tpl>',
											'<tpl if="this.isNull(primaryContact) == true">',
											'Primary Contact:&nbsp;N/A',
											'</tpl>',
											'</div>',
											'<div class="list-item-narrative">',
											'<tpl if="this.isNull(salesMethod) == false">',
											'Sales Method:&nbsp;{salesMethod};&nbsp;&nbsp;',
											'</tpl>',
											'<tpl if="this.isNull(salesMethod) == true">',
											'Sales Method:&nbsp;N/A;&nbsp;&nbsp;',
											'</tpl>',
											'<tpl if="this.isNull(salesStage) == false">',
											'Sales Stage:&nbsp;{salesStage};&nbsp;&nbsp;',
											'</tpl>',
											'<tpl if="this.isNull(salesStage) == true">',
											'Sales Stage:&nbsp;N/A;&nbsp;&nbsp;',
											'</tpl>',
											'Close Date:&nbsp;{closeDate}',
											'</div>',
											'<div class="list-item-narrative">Probability:&nbsp;',
											'<tpl if="this.isNull(probability) == false">',
											'{probability}',
											'</tpl>',
											'<tpl if="this.isNull(probability) == true">',
											'N/A',
											'</tpl>',
											';&nbsp;&nbsp;Revenue:&nbsp;',
											'<tpl if="this.isNull(revenue) == false">',
											'{revenue}',
											'</tpl>',
											'<tpl if="this.isNull(revenue) == true">',
											'N/A', '</tpl>', '</div>', '</div>',{
												isNull : function(val) {
													if (val.trim() == '') {
														return true;
													}
													if (val) {
														return false;
													}
													return true;
												}
											}

									),
									store : synchronicity.stores.transientOpportunities,
									ui : 'round',
									singleSelect : true,
									scroll : false,
									emptyText : '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No opportunities found...</div>',
									onItemDisclosure : true,
									listeners : {
										itemtap : function(list, index, item, e) {
											if (e.getTarget('.x-list-disclosure')) {
												Ext.getCmp('synchronicity.views.opportunityList').fireEvent(
																'navigateTo',
																list.getStore().getAt(index),
																Ext.getCmp('synchronicity.views.opportunityDetail'),
																true,
																'synchronicity.views.opportunityList');
												new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(1000);
											} else {
												Ext.dispatch({
							                         controller: synchronicity.controllers.opportunity,
							                         action: 'showOpportunityForm',
							                         record: list.getStore().getAt(index),
						 	                         component: list,
						 	                         componentSelModel: list.selModel,
						 	                         mode: 'update'
							                     });
											}
										}
									}
								});

						this.fieldSet = new Ext.form.FieldSet({
							title : 'My Opportunities',
							monitorOrientation : true,
							items : [ this.list ]
						});

						this.items = [ this.fieldSet ];
						synchronicity.views.ContactList.superclass.initComponent.apply(this, arguments);
					},

					getNavigationBarItems : function() {
						var panelObject = this;
						this.searchIcon = new Ext.Button(
								{
									iconCls : 'search',
									iconMask : true,
									handler : function() {
										panelObject.scroller.scrollTo({
											x : 0,
											y : 0
										}, true);
										Ext
												.dispatch({
													controller : synchronicity.controllers.opportunity,
													action : 'showSearchBox',
													baxObject : this
												});
									}
								});
						this.addIcon = new Ext.Button(
								{
									iconCls : 'add',
									iconMask : true,
									handler : function() {
										Ext.dispatch({
					                         controller: synchronicity.controllers.opportunity,
					                         action: 'showOpportunityForm',
					                         component: this.list,
					                         mode: 'add'
					                     });
									}
								});
						this.navigationBarItems = [ {xtype : 'spacer'}, this.searchIcon ];
						return this.navigationBarItems;
					},

					initialize : function() {
						Ext.dispatch({
							controller : synchronicity.controllers.opportunity,
							action : 'initializeOpportunityList'
						});
					}
				});
