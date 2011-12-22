Ext.regModel('synchronicity.models.PersistentContact', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'firstName', type: 'string'},
	         {name: 'lastName', type: 'string'},
	         {name: 'title', type: 'string'},
	         {name: 'department', type: 'string'},
	         {name: 'workPhone', type: 'string'},
	         {name: 'cellPhone', type: 'string'},
	         {name: 'email', type: 'string'},
	         {name: 'addressLine1', type: 'string'},
	         {name: 'addressLine2', type: 'string'},
	         {name: 'city', type: 'string'},
	         {name: 'state', type: 'string'},
	         {name: 'zipcode', type: 'string'},
	         {name: 'status', type: 'string'},
	         {name: 'guid', type: 'string'}	         
	         ],
	         
	         
     proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-contact'
     }
});