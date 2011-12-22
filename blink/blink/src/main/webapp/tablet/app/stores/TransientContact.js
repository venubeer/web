synchronicity.stores.transientContacts = new Ext.data.Store({
    model: 'synchronicity.models.TransientContact'
});

Ext.regStore('synchronicity.stores.transientContacts', synchronicity.stores.transientContacts);

synchronicity.stores.transientContactSingle = new Ext.data.Store({
    model: 'synchronicity.models.TransientContactSingle'
});

Ext.regStore('synchronicity.stores.transientContactSingle', synchronicity.stores.transientContactSingle);

synchronicity.stores.transientAccountContacts = new Ext.data.Store({
    model: 'synchronicity.models.TransientAccountContact'
});

Ext.regStore('synchronicity.stores.transientAccountContacts', synchronicity.stores.transientAccountContacts);

synchronicity.stores.transientOpportunityContacts = new Ext.data.Store({
    model: 'synchronicity.models.TransientOpportunityContact'
});

Ext.regStore('synchronicity.stores.transientOpportunityContacts', synchronicity.stores.transientOpportunityContacts);


synchronicity.stores.transientActivityContacts = new Ext.data.Store({
    model: 'synchronicity.models.TransientActivityContact'
});

Ext.regStore('synchronicity.stores.transientActivityContacts', synchronicity.stores.transientActivityContacts);