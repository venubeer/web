synchronicity.controllers.home = new Ext.Controller({
	
	showAlertDetail: function(options){
		var record = options.record.data;
		this.alertDetailView = new synchronicity.views.AlertDetail({
				listeners: {
                    scope: this,
                    hide : function() {
                        options.component.view.getSelectionModel().deselectAll();
                    }
                }
			});
		this.alertDetailView.abstractTxtAreaFld.setValue(record.abstract);
		this.alertDetailView.messageTxtAreaFld.setValue(record.message);
		//this.alertDetailView.showBy(options.showByItem,'fade',false);
		this.alertDetailView.show('fade');
	},
	
	
	hideAlertDetail: function(options){
		this.alertDetailView.hide();
	}
	
	
});