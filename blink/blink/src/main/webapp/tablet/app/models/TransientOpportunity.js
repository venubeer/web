Ext.regModel('synchronicity.models.TransientOpportunity', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'salesMethod', type: 'string'},
	         {name: 'salesStage', type: 'string'},
	         {name: 'probability', type: 'string'},
	         {name: 'closeDate', type: 'string'},
	         {name: 'revenue', type: 'string'},
	         {name: 'reasonWonLost', type: 'string'},
	         {name: 'comments', type: 'string'},
	         {name: 'accountGuid', type: 'string'},
	         {name: 'accountNumber', type: 'string'},
	         {name: 'accountName', type: 'string'},
	         {name: 'primaryContactGuid', type: 'string'},
	         {name: 'primaryContact', type: 'string'},
	         {name: 'contactIds', type: 'string'},
	         {name: 'guid', type: 'string'}      
	         ],
	         
	         
     proxy: {type: 'sessionstorage',
    	 	 id: 'blink-opportunity'
	 }
});


Ext.regModel('synchronicity.models.TransientOpportunitySingle', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'salesMethod', type: 'string'},
	         {name: 'salesStage', type: 'string'},
	         {name: 'probability', type: 'string'},
	         {name: 'closeDate', type: 'string'},
	         {name: 'revenue', type: 'string'},
	         {name: 'reasonWonLost', type: 'string'},
	         {name: 'comments', type: 'string'},
	         {name: 'accountGuid', type: 'string'},
	         {name: 'accountNumber', type: 'string'},
	         {name: 'accountName', type: 'string'},
	         {name: 'primaryContactGuid', type: 'string'},
	         {name: 'primaryContact', type: 'string'},
	         {name: 'guid', type: 'string'}      
	         ]
});