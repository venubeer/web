Ext.regModel('synchronicity.models.TransientAccount', {
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
	         {name: 'guid', type: 'string'}
	         ],
	         
	         
     proxy: {type: 'sessionstorage',
          	 id: 'blink-account'
     }
});


Ext.regModel('synchronicity.models.TransientAccountSingle', {
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
	         {name: 'guid', type: 'string'}
	         ]
});