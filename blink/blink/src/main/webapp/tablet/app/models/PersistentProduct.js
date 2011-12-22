Ext.regModel('synchronicity.models.PersistentProduct', {
	fields: [
	         {name: 'id', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'code', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'parentProductGuid', type: 'string'},
	         {name: 'detailFlag', type: 'string'},
	         {name: 'salesFlag', type: 'string'},
	         {name: 'accountSegmentFlag', type: 'string'},
	         {name: 'contactSegmentFlag', type: 'string'},
	         {name: 'guid', type: 'string'},
	         {name: 'product', type: 'string',
	             convert: function(v, rec) {
	                 return rec.data.code + " - " + rec.data.name;
	             }
	         }
	         ],
	         
	proxy: {
    		type: 'localstorage',
    		id: 'blink-local-storage-product'
	}
});