synchronicity.views.ReportPanel = Ext.extend(Ext.Panel,
{
	id : 'synchronicity.views.reportPanel',
	scroll : 'vertical',
	fullscreen : true,
	html: '',
	
	initComponent : function() {
		this.button = new Ext.Button({
            text: 'Done',
            ui: 'action',
            handler: function(cmp) {
			 			synchronicity.views.viewport.setActiveItem(synchronicity.views.main, 'fade');
		 			  }
        });
		this.btns = [{xtype: 'spacer', flex: 1}, this.button];
		this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: this.title,
            items: this.btns
        });
		
		this.dockedItems = [this.navigationBar];
		synchronicity.views.ReportPanel.superclass.initComponent.apply(this,arguments);
	},
	
	changeTitle: function(newTitle) {
		this.navigationBar.setTitle(newTitle);
		this.navigationBar.doLayout();
	},
	
	runURL: function(url) {
		thisComponent = this;
		url = url.replace(/@@@Division@@@/g,synchronicity.app.properties.division);
		url = url.replace(/@@@Position@@@/g,synchronicity.app.properties.position);
		url = url.replace(/@@@UserId@@@/g,synchronicity.app.properties.userId);
		Ext.Ajax.request({
			url: synchronicity.app.properties.interimReportLoginUrl,
			timeout: "10000",
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
		var task = new Ext.util.DelayedTask(function(){
			thisComponent.update('<iframe src="'+url+'" style="width:100%;height:100%;overflow:scroll;"></iframe>');
		    Ext.getBody().unmask();	
		});
		task.delay(1000);
	}
	
});