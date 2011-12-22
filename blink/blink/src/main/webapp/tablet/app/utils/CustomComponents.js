Ext.ns('Ext.ux.form');

Ext.ux.form.DateTimePicker = Ext.extend(Ext.form.Text, {
    inputType: 'datetime',
    
	setValue: function() {
		Ext.ux.form.DateTimePicker.superclass.setValue.apply(this, arguments);

        this.updateClearIconVisibility();
    }
});

Ext.ux.form.DatePicker = Ext.extend(Ext.form.Text, {
    inputType: 'date'
});

Ext.ux.form.Telephone = Ext.extend(Ext.form.Text, {
    inputType: 'tel'
});

Ext.reg('baxdatetimepicker', Ext.ux.form.DateTimePicker);
Ext.reg('baxdatepicker', Ext.ux.form.DatePicker);
Ext.reg('baxtelephone', Ext.ux.form.Telephone);