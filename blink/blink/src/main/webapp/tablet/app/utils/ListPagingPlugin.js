synchronicity.views.ListPagingPlugin = Ext.extend(Ext.util.Observable, {
    
	loadMoreText: 'Load More...',
	
    init: function(list) {
    	this.list = list;

        list.onBeforeLoad = Ext.util.Functions.createInterceptor(list.onBeforeLoad, this.onBeforeLoad, this);

        this.mon(list, 'update', this.onListUpdate, this);

    },
    
    onListUpdate : function(list) {
    	this.list = list;
    	if (this.list.store && this.list.store.data.length < (this.list.store.currentPage * this.list.store.pageSize)){
    		if (!this.rendered) {
                return false;
            } 
    		else {
                this.loading = false;
            }
            return false;
    	}
    	if (!this.rendered) {
            this.render();
        }
        this.el.appendTo(this.list.getTargetEl());
        this.loading = false;
        this.el.removeCls('x-loading');
    },
    
    
    render : function() {
        var list = this.list,
            targetEl = list.getTargetEl(),
            html = '<div class="x-list-paging-msg">' + this.loadMoreText + '</div>';

        this.el = targetEl.createChild(	{	cls: 'x-list-paging',
										            html: html + Ext.LoadingSpinner
									        });
        this.mon(this.el, 'tap', this.onPagingTap, this);
        
        this.rendered = true;
    },
    

    onBeforeLoad : function(cmp) {
    	if (this.loading && this.list.store.getCount() > 0) {
            this.list.loadMask.disable();
            return false;
        }
    },
    

    onPagingTap : function(e) {
    	if (!this.loading) {
            this.loading = true;
            this.el.addCls('x-loading');
            this.list.store.nextPage();
            this.list.loadMask.disable();
        }
    }
});

Ext.preg('listpaging', synchronicity.views.ListPagingPlugin);


    