synchronicity.views.Main = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    items: [{
    	cls: 'launchscreen',
    	html: '<div><h1>Welcome</h1><p>Please use the Navigation Panel/Navigation Button to navigate through the application.</p></div>'
    }],
    backText: 'Back',
    useTitleAsBackText: true,
    initComponent : function() {
    	
    	this.navigationButton = new Ext.Button({
            hidden: Ext.is.Phone || Ext.Viewport.orientation == 'landscape',
            text: 'Navigation',
            id: 'mainNavigationButton',
            handler: this.onNavButtonTap,
            scope: this
        });
    	
    	this.backButton = new Ext.Button({
            text: this.backText,
            id: 'mainBackButton',
            ui: 'back',
            handler: this.onUiBack,
            hidden: true,
            scope: this
        });
    	
    	this.logoutButton = new Ext.Button({
            text: 'Logout',
            id: 'mainLogoutButton',
            id: 'logout',
            handler: this.onLogoutButtonTap,
            scope: this
        });
        
        this.btns = [this.navigationButton];
        if (Ext.is.Phone) {
        	this.btns.unshift(this.logoutButton);
        	this.btns.unshift(new Ext.Spacer({flex: 1}));
            this.btns.unshift(this.backButton);
        }

        this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: this.title,
            items: this.btns
        });
        
        this.navigationPanel = new Ext.NestedList({
            store: synchronicity.stores.navigation,
            useToolbar: Ext.is.Phone ? false : true,
            updateTitleText: false,
            dock: 'left',
            hidden: !Ext.is.Phone && Ext.Viewport.orientation == 'portrait',
            toolbar: Ext.is.Phone ? this.navigationBar : null,
            listeners: {
                itemtap: this.onNavPanelItemTap,
                scope: this
            }
        });

        if (!Ext.is.Phone) {
        	this.navigationPanel.toolbar.items.insert(1,new Ext.Spacer({flex: 1}));
        	this.navigationPanel.toolbar.items.insert(2,this.logoutButton);        	
        }
        
        this.navigationPanel.on('back', this.onNavBack, this);

        if (!Ext.is.Phone) {
            this.navigationPanel.setWidth(250);
        }

        this.dockedItems = this.dockedItems || [];
        this.dockedItems.unshift(this.navigationBar);

        if (!Ext.is.Phone && Ext.Viewport.orientation == 'landscape') {
            this.dockedItems.unshift(this.navigationPanel);
        }
        else if (Ext.is.Phone) {
            this.items = this.items || [];
            this.items.unshift(this.navigationPanel);
        }
        
        this.cardNavigationBarItems=[];
        
        this.addEvents('navigate');
        
        synchronicity.views.Main.superclass.initComponent.call(this);
        
        Ext.getCmp('synchronicity.views.home').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.accountList').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.contactList').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.opportunityList').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.settings').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.accountDetail').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.contactDetail').on('navigateTo', this.navigateTo, this);
        Ext.getCmp('synchronicity.views.opportunityDetail').on('navigateTo', this.navigateTo, this);
    },
    
    toggleUiBackButton: function() {
        var navPnl = this.navigationPanel;

        if (Ext.is.Phone) {
            if (this.getActiveItem() === navPnl) {

                var currList      = navPnl.getActiveItem(),
                    currIdx       = navPnl.items.indexOf(currList),
                    recordNode    = currList.recordNode,
                    title         = navPnl.renderTitleText(recordNode),
                    parentNode    = recordNode ? recordNode.parentNode : null,
                    backTxt       = (parentNode && !parentNode.isRoot) ? navPnl.renderTitleText(parentNode) : this.title || '',
                    activeItem;


                if (currIdx <= 0) {
                    this.navigationBar.setTitle(this.title || '');
                    this.backButton.hide();
                } else {
                    this.navigationBar.setTitle(title);
                    if (this.useTitleAsBackText) {
                        this.backButton.setText(backTxt);
                    }

                    this.backButton.show();
                }
                this.logoutButton.show();
            } else {
                activeItem = navPnl.getActiveItem();
                recordNode = activeItem.recordNode;
                backTxt    = (recordNode && !recordNode.isRoot) ? navPnl.renderTitleText(recordNode) : this.title || '';

                if (this.useTitleAsBackText) {
                    this.backButton.setText(backTxt);
                }
                this.backButton.show();
                this.logoutButton.hide();
            }
            this.navigationBar.doLayout();
        }

    },

    onUiBack: function() {
        var navPnl = this.navigationPanel;

        if (this.getActiveItem() === navPnl) {
            navPnl.onBackTap();
        } else {
            this.setActiveItem(navPnl, {
                type: 'slide',
                reverse: true
            });
        }
        this.toggleUiBackButton();
        this.fireEvent('navigate', this, {});
    },

    onNavPanelItemTap: function(subList, subIdx, el, e) {
    	var thisPanel = this;
    	var store  = subList.getStore(),
        record     = store.getAt(subIdx),
        recordNode = record.node,
        nestedList = this.navigationPanel,
        title      = nestedList.renderTitleText(recordNode),
        card;

    	if (record) {
	        card = record.get('card');
	    }
	    
	    if (Ext.Viewport.orientation == 'portrait' && !Ext.is.Phone && !recordNode.childNodes.length) {
	        this.navigationPanel.hide();
	    }
	    
        if (title) {
	        this.navigationBar.setTitle(title);
	    }
	    
	    var item,
        removeItems = this.navigationBar.items.items.slice(),
        items = [],
        ln = removeItems.length,
        i;
	    
	    for (i=0; i<ln; i++){
	    	item = removeItems[i];
	    	if (item.id == 'mainNavigationButton' ||item.id == 'mainBackButton' ||item.id == 'mainLogoutButton' ){
	    		
	    	}
	    	else {
	    		this.navigationBar.remove(item);
	    	}
	    }
	    
	    try {
	    	this.cardNavigationBarItems = card.getNavigationBarItems();
	    	this.navigationBar.add(this.cardNavigationBarItems);
	    }
	    catch(e){}
	    
	    if (card) {
	    	Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
	    	var task = new Ext.util.DelayedTask(function(){
	    		card.initialize();
		        thisPanel.setActiveItem(card, 'slide');
		        thisPanel.currentCard = card;
		        Ext.getBody().unmask();	
			});
			task.delay(500);	    	
	    }
	    
	    this.navigationBar.doLayout();
	    
	    this.toggleUiBackButton();	    
	    this.fireEvent('navigate', this, record);
    },

    onLogoutButtonTap: function() {
    	if (Ext.Viewport.orientation == 'portrait' && !Ext.is.Phone) {
	        this.navigationPanel.hide();
	    };
    	Ext.dispatch({
            controller: synchronicity.controllers.login,
            action: 'logout'
        });
    },
    
    onNavButtonTap : function() {
        this.navigationPanel.showBy(this.navigationButton, 'fade');
    },

    layoutOrientation : function(orientation, w, h) {
        if (!Ext.is.Phone) {
            if (orientation == 'portrait') {
                this.navigationPanel.hide(false);
                this.removeDocked(this.navigationPanel, false);
                if (this.navigationPanel.rendered) {
                    this.navigationPanel.el.appendTo(document.body);
                }
                this.navigationPanel.setFloating(true);
                this.navigationPanel.setHeight(400);
                this.navigationButton.show(false);
            }
            else {
                this.navigationPanel.setFloating(false);
                this.navigationPanel.show(false);
                this.navigationButton.hide(false);
                this.insertDocked(0, this.navigationPanel);
            }
            this.navigationBar.doComponentLayout();
        }

        synchronicity.views.Main.superclass.layoutOrientation.call(this, orientation, w, h);
    },
    
    navigateTo: function (record, card, initialize, returnTo) {
    	var thisPanel = this;
    	if (card) {
    		Ext.getBody().mask('<div class="demos-loading">Loading...</div>');
	    	var task = new Ext.util.DelayedTask(function(){
	    		if (initialize) {
	    			card.initialize(record);
	    		}
	    		if (initialize){
	    			thisPanel.setActiveItem(card, 'slide');
	    		}
	    		else {
	    			thisPanel.setActiveItem(card, {type:'slide',direction:'right'});
	    		}
	    		thisPanel.currentCard = card;
		        Ext.getBody().unmask();	
			});
			task.delay(500);	 
	    }

	    var item,
        removeItems = this.navigationBar.items.items.slice(),
        items = [],
        ln = removeItems.length,
        i;
	    
	    for (i=0; i<ln; i++){
	    	item = removeItems[i];
	    	if (item.id == 'mainNavigationButton' ||item.id == 'mainBackButton' ||item.id == 'mainLogoutButton' ){
	    		
	    	}
	    	else {
	    		this.navigationBar.remove(item);
	    	}
	    }
	    
	    try {
	    	if (returnTo){
	    		this.cardNavigationBarItems = card.getNavigationBarItems(returnTo);
	    	}
	    	else {
	    		this.cardNavigationBarItems = card.getNavigationBarItems();
	    	}
	    	this.navigationBar.add(this.cardNavigationBarItems);
	    }
	    catch(e){}
	    
	    this.navigationBar.doLayout();
	    
	    this.toggleUiBackButton();	    
	    this.fireEvent('navigate', this, record);
    }
});