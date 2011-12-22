Ext.regModel('synchronicity.models.PersistentActivity', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'category', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'subType', type: 'string'},
	         {name: 'startDate', type: 'string'},
	         {name: 'endDate', type: 'string'},
	         {name: 'dueOn', type: 'string'},
	         {name: 'status', type: 'string'},
	         {name: 'subject', type: 'string'},
	         {name: 'description', type: 'string'},
	         {name: 'opportunityGuid', type: 'string'},
	         {name: 'accountGuid', type: 'string'},
	         {name: 'accountNumber', type: 'string'},
	         {name: 'accountName', type: 'string'},
	         {name: 'primaryContactGuid', type: 'string'},
	         {name: 'primaryContact', type: 'string'},
	         {name: 'contactIds', type: 'string'},
	         {name: 'guid', type: 'string'}
	         ],
			
     proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-activity'
     }
});
