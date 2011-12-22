synchronicity.stores.settings = new Ext.data.Store({
    model: 'synchronicity.models.Settings',
    autoLoad: true
});

Ext.regStore('synchronicity.stores.settings', synchronicity.stores.settings);