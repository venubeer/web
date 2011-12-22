Ext.regModel('synchronicity.models.TransientProduct', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'parentProductGuid', type: 'string'},
	         {name: 'guid', type: 'string'}
	         ],
	         
     proxy: {type: 'sessionstorage',
	         id: 'blink-product'
	 }
});