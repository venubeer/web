Ext.regModel('synchronicity.models.TransientActivity', {
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
	         
	         
     proxy: {type: 'sessionstorage',
	      	 id: 'blink-activity'
	 }
});



Ext.regModel('synchronicity.models.TransientActivitySingle', {
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
	         {name: 'guid', type: 'string'}	         
	         ]
});


Ext.regModel('synchronicity.models.TransientAccountActivity', {
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
	         
	         
     proxy: {type: 'sessionstorage',
	      	 id: 'blink-account-activity'
	 }
});


Ext.regModel('synchronicity.models.TransientContactActivity', {
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
	         
	         
     proxy: {type: 'sessionstorage',
	      	 id: 'blink-contact-activity'
	 }
});


Ext.regModel('synchronicity.models.TransientOpportunityActivity', {
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
	         
	         
     proxy: {type: 'sessionstorage',
	      	 id: 'blink-opportunity-activity'
	 }
});