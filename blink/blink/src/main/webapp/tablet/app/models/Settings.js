Ext.regModel('synchronicity.models.Settings', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'userId', type: 'string'},
	         {name: 'password', type: 'string'},
	         {name: 'userType', type: 'string'},
	         {name: 'userTitle', type: 'string'},
	         {name: 'userOrganization', type: 'string'},
	         {name: 'loggedOut', type:'string'},
	         {name: 'lastSynchronizedOn', type:'date', dateFormat:'c'},
	         {name: 'initializedOn', type:'date', dateFormat:'c'},
	         {name: 'initializedForUserId', type:'string'},
	         {name: 'lastLoggedIn', type: 'date', dateFormat:'c'},
	         {name: 'lastNavigatedTo'},
	         {name: 'position', type:'string'},
	         {name: 'division', type:'string'},
	],
	
	proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-settings'
	}
});