synchronicity.views.ReportList = Ext.extend(Ext.form.FormPanel,
{
	id : 'synchronicity.views.reportList',
	scroll : 'vertical',
	fullscreen : true,
	items : [],
	initComponent : function() {
		this.list = new Ext.List(
				{
					itemTpl : new Ext.XTemplate(
							'<div class="list-item-title"> {name}',
							'</div>',
							'<div class="list-item-narrative">',
							'{description}',
							'</div>'
					),
					store : synchronicity.stores.reports,
					ui : 'round',
					singleSelect: true,
					scroll : false,
					emptyText : '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No reports found...</div>',
					onItemDisclosure : false,
					listeners : {
						itemtap : function(list, index, item, e) {
							Ext.dispatch({
					            controller: synchronicity.controllers.login,
					            action: 'checkServerAuthenticate',
					            callback: function(){
									var titleText = list.getStore().getAt(index).get('name');
									var url = list.getStore().getAt(index).get('url');
									synchronicity.views.reportPanel.changeTitle(titleText);
									synchronicity.views.viewport.setActiveItem(synchronicity.views.reportPanel, 'fade');
									Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
									synchronicity.views.reportPanel.runURL(url);
					            }
							});
							new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(1000);
						}
					}
				});

		this.fieldSet = new Ext.form.FieldSet({
			title : 'My Reports',
			monitorOrientation : true,
			items : [ this.list ]
		});

		this.items = [ this.fieldSet ];
		synchronicity.views.ReportList.superclass.initComponent.apply(this, arguments);
	},

	getNavigationBarItems : function() {
		
	},

	initialize : function() {
		
	}
});
