Ext.regModel('synchronicity.models.TransientContact', {
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
	         
	         
     proxy: {type: 'sessionstorage',
  		     id: 'blink-contact'
	 }
});


Ext.regModel('synchronicity.models.TransientContactSingle', {
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
	         ]
});


Ext.regModel('synchronicity.models.TransientAccountContact', {
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
	         
	         
     proxy: {type: 'sessionstorage',
  		     id: 'blink-account-contact'
	 }
});


Ext.regModel('synchronicity.models.TransientOpportunityContact', {
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
	         
	         
     proxy: {type: 'sessionstorage',
  		     id: 'blink-opportunity-contact'
	 }
});

Ext.regModel('synchronicity.models.TransientActivityContact', {
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
	         
	         
     proxy: {type: 'sessionstorage',
  		     id: 'blink-activity-contact'
	 }
});