Ext.regModel('synchronicity.models.PersistentListOfValue', {
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
	         
	         
     proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-lovs'
     }
});