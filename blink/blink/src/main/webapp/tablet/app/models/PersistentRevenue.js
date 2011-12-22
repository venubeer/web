Ext.regModel('synchronicity.models.PersistentRevenue', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'productCode', type: 'string'},
	         {name: 'productName', type: 'string'},
	         {name: 'productId', type: 'string'},
	         {name: 'units', type: 'float'},
	         {name: 'price', type: 'float'},
	         {name: 'revenueType', type: 'string'},
	         {name: 'revenueInterval', type: 'string'},
	         {name: 'revenueStartDate', type: 'string'},
	         {name: 'revenueEndDate', type: 'string'},
	         {name: 'parentRevenueGuid', type: 'string'},
	         {name: 'revenueClass', type: 'string'},
	         {name: 'opportunityGuid', type: 'string'},
	         {name: 'guid', type: 'string'}
	         ],
	         
	         
     proxy: {
		type: 'localstorage',
		id: 'blink-local-storage-revenue'
     }
});