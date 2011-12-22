Ext.regApplication({
	name: 'synchronicity',
	launch: function() {
		this.views.viewport = new this.views.Viewport();
		synchronicity.views.login.autoAuthenticate();
	}
});


Ext.setup({
    tabletStartupScreen: 'resources/images/synchronicity_tablet_startup.png',
    phoneStartupScreen: 'resources/images/synchronicity_phone_startup.png',
    icon: 'resources/images/icon.png',
    glossOnIcon: false
});

Ext.namespace('synchronicity.app.properties');
synchronicity.ap.properties.baseUrl=window.location.protocol+'//'+window.location.host+'/blink';
synchronicity.app.properties.loginUrl=window.location.protocol+'//'+window.location.host+'/blink/j_security_check';
synchronicity.app.properties.logoffUrl=window.location.protocol+'//'+window.location.host+'/blink/auth/logoff';
synchronicity.app.properties.baseSiebelDataUrl=window.location.protocol+'//'+window.location.host+'/blink/data/siebel/';
synchronicity.app.properties.interimReportLoginUrl=window.location.protocol+'//'+window.location.host+'/ssor/j_security_check';
