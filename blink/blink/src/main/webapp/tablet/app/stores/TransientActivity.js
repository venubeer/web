synchronicity.stores.transientActivities = new Ext.data.Store({
    model: 'synchronicity.models.TransientActivity'
});

Ext.regStore('synchronicity.stores.transientActivities', synchronicity.stores.transientActivities);

synchronicity.stores.transientActivitySingle = new Ext.data.Store({
    model: 'synchronicity.models.TransientActivitySingle'
});

Ext.regStore('synchronicity.stores.transientActivitySingle', synchronicity.stores.transientActivitySingle);

synchronicity.stores.transientAccountActivities = new Ext.data.Store({
    model: 'synchronicity.models.TransientAccountActivity'
});

Ext.regStore('synchronicity.stores.transientAccountActivities', synchronicity.stores.transientAccountActivities);

synchronicity.stores.transientContactActivities = new Ext.data.Store({
    model: 'synchronicity.models.TransientContactActivity'
});

Ext.regStore('synchronicity.stores.transientContactActivities', synchronicity.stores.transientContactActivities);

synchronicity.stores.transientOpportunityActivities = new Ext.data.Store({
    model: 'synchronicity.models.TransientOpportunityActivity'
});

Ext.regStore('synchronicity.stores.transientOpportunityActivities', synchronicity.stores.transientOpportunityActivities);