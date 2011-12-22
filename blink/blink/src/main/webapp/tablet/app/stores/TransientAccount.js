synchronicity.stores.transientAccounts = new Ext.data.Store({
    model: 'synchronicity.models.TransientAccount'
});

Ext.regStore('synchronicity.stores.transientAccounts', synchronicity.stores.transientAccounts);

synchronicity.stores.transientAccountSingle = new Ext.data.Store({
    model: 'synchronicity.models.TransientAccountSingle',
    data: []
});

Ext.regStore('synchronicity.stores.transientAccountSingle', synchronicity.stores.transientAccountSingle);