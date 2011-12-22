Ext.regModel('synchronicity.models.TransientListOfValue', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'value', type: 'string'},
	         {name: 'orderBy', type: 'float'},
	         {name: 'parentGuid',type: 'string'},
	         {name: 'parentName',type: 'string'},
	         {name: 'parentValue',type: 'string'},
	         {name: 'guid', type: 'string'}
	         ],
	         
	         
     proxy: {type: 'sessionstorage',
  		      id: 'blink-listofvalue'
	 }
});