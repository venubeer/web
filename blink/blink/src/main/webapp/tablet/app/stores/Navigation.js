synchronicity.stores.navigation = new Ext.data.TreeStore({
    model: 'synchronicity.models.Navigation',
    root: {
        items: [
              	{
                	text: 'Home',
                	card: synchronicity.views.home,
                    leaf: true        
                },
                {
                	text: 'Accounts',
                	card: synchronicity.views.accountList,
                	leaf: true
                },
                {
                	text: 'Contacts',
                	card: synchronicity.views.contactList,
                    leaf: true
                },
                {
                	text: 'Opportunities',
                	card: synchronicity.views.opportunityList,
                    leaf: true
                },
                {
                	text: 'Activities',
                	card: synchronicity.views.activityList,
                    leaf: true
                },
                {
                	text: 'Reports',
                	card: synchronicity.views.reportList,
                    leaf: true
                },
                {
                	text: 'Settings',
                	card: synchronicity.views.settings,
                    leaf: true
                }
          ]
    },
    proxy: {
        type: 'ajax',
        id: 'navigation-proxy',
        reader: {
            type: 'tree',
            root: 'items'
        }
    }
});