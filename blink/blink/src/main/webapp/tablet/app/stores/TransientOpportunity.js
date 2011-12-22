synchronicity.stores.transientOpportunities = new Ext.data.Store({
    model: 'synchronicity.models.TransientOpportunity'
});

Ext.regStore('synchronicity.stores.transientOpportunities', synchronicity.stores.transientOpportunities);


synchronicity.stores.transientOpportunitySingle = new Ext.data.Store({
    model: 'synchronicity.models.TransientOpportunitySingle'
});

Ext.regStore('synchronicity.stores.transientOpportunitySingle', synchronicity.stores.transientOpportunitySingle);