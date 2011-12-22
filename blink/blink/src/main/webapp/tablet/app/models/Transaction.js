Ext.regModel('synchronicity.models.Transaction', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'operation', type: 'string'},
	         {name: 'objectId', type: 'string'},
	         {name: 'childObjectId', type: 'string'}
	         ],
	                        
	                        
    proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-transaction'
	}
});