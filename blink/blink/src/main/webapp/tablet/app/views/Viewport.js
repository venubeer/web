synchronicity.views.Viewport = Ext.extend(Ext.Panel,{
	fullscreen: true,
	layout: 'card',
	cardSwitchAnimation: 'slide',
    initComponent : function() {
    	Ext.apply(synchronicity.views, {
            login: new synchronicity.views.Login(),
            main: new synchronicity.views.Main({title: 'Welcome',useTitleAsBackText: false}),
            reportPanel: new synchronicity.views.ReportPanel()
        });
        //put instances of cards into viewport
        Ext.apply(this, {
            items: [
                synchronicity.views.login,
                synchronicity.views.main,
                synchronicity.views.reportPanel
            ]
        });
        
        synchronicity.views.Viewport.superclass.initComponent.apply(this,arguments);
    }
});