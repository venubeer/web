Ext.regModel('synchronicity.models.PersistentAccount', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'number', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'class', type: 'string'},
	         {name: 'billingType', type: 'string'},
	         {name: 'addressLine1', type: 'string'},
	         {name: 'addressLine2', type: 'string'},
	         {name: 'city', type: 'string'},
	         {name: 'state', type: 'string'},
	         {name: 'zipcode', type: 'string'},
	         {name: 'status', type: 'string'},
	         {name: 'focusAccount', type: 'string'},	        
	         {name: 'contactIds', type: 'string'},
	         {name: 'guid', type: 'string'},
	         {name: 'accountNumName', type: 'string',
	             convert: function(v, rec) {
	                 return rec.data.number + " - " + rec.data.name;
	             }
	         }
	         ],
	         
	         
     proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-account'
     }
});