synchronicity.views.ContactList = Ext.extend(Ext.form.FormPanel, {
	id: 'synchronicity.views.contactList',
	scroll: 'vertical',
	fullscreen: true,
	items: [],
 	initComponent: function() {
		 this.list = new Ext.List({
			 itemTpl : new Ext.XTemplate(
					 	'<div>',
				 		'<div class="list-item-title"> {lastName},&nbsp;{firstName}&nbsp;',
				 		'<tpl if="this.isNull(department) == false">',
				 			'({department}/{title})',
				 		'</tpl>',
				 		'<tpl if="this.isNull(department) == true">',
				 			'(No Department/Title)',
				 		'</tpl>',
				 		'</div>',
				 		'<div class="list-item-narrative">',
				 		'<tpl if="this.isNull(addressLine1+addressLine2+city+state+zipcode) == true">',
				 			'No Address Info',
				 		'</tpl>',
				 		'{addressLine1}',
				 		'<tpl if="addressLine2">',
				 			',&nbsp;',
				 		'</tpl>',
				 		'{addressLine2}',
				 		'<tpl if="city">',
			 				',&nbsp;',
			 			'</tpl>',
				 		'{city}',
				 		'<tpl if="state">',
			 				',&nbsp;',
			 			'</tpl>',
				 		'{state}&nbsp;{zipcode}',
			 			'</div>',
				 		'<div class="list-item-narrative">Work#:&nbsp;',
				 		'<tpl if="this.isNull(workPhone) == false">',
				 			'{workPhone}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(workPhone) == true">',
				 			'N/A',
				 		'</tpl>',
				 		';&nbsp;&nbsp;Cell#:&nbsp;',
				 		'<tpl if="this.isNull(cellPhone) == false">',
				 			'{cellPhone}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(cellPhone) == true">',
				 			'N/A',
				 		'</tpl>',
				 		';&nbsp;&nbsp;E-Mail:&nbsp;',
				 		'<tpl if="this.isNull(email) == false">',
				 			'{email}',
				 		'</tpl>',
				 		'<tpl if="this.isNull(email) == true">',
				 			'N/A',
				 		'</tpl>',
				 		'</div>',	
				 		'</div>',
				 		{
				 			isNull: function(val){
				 				if (val) {
				 					return false;
				 				}
				 				return true;
				 			}
				 		}
			 
			 ),
             store: synchronicity.stores.transientContacts,
             ui: 'round',
	         singleSelect: true,
             scroll: false,
             emptyText: '<div class="list-item-title">&nbsp;&nbsp;&nbsp;No contacts found...</div>',
             onItemDisclosure: true,
	 		 listeners:{
		 			itemtap : function(list,index,item,e){
		 				if (e.getTarget('.x-list-disclosure')) {
				     		Ext.getCmp('synchronicity.views.contactList').fireEvent('navigateTo', 
				     																list.getStore().getAt(index),
				     																Ext.getCmp('synchronicity.views.contactDetail'),
				     																true);
				     		new Ext.util.DelayedTask(function(){list.selModel.view.getSelectionModel().deselectAll();}).delay(1000);
				     	} 
				     	else {
				     		Ext.dispatch({
	 	                         controller: synchronicity.controllers.contact,
	 	                         action: 'showContactForm',
	 	                         record: list.getStore().getAt(index),
	 	                         component: list,
	 	                         componentSelModel: list.selModel,
	 	                         mode: 'update'
	 	                     });
				     	}
		 			}
	 		 }
 		});
		
		this.fieldSet = new Ext.form.FieldSet({
				title: 'My Contacts',
		        monitorOrientation: true,
		        items: [this.list]
		});
		
		this.items = [this.fieldSet];
		synchronicity.views.ContactList.superclass.initComponent.apply(this,arguments);
	 },

	 getNavigationBarItems: function(){
		 var panelObject = this;
		 this.searchIcon = new Ext.Button({
					            iconCls: 'search',
					            iconMask: true,
					            handler: function(){
					            	panelObject.scroller.scrollTo({x: 0, y: 0}, true);
					            	Ext.dispatch({
				                         controller: synchronicity.controllers.contact,
				                         action: 'showSearchBox',
				                         baxObject: this
				                     });
					            }					            
					        });
		 this.addIcon = new Ext.Button({
	            iconCls: 'add',
	            iconMask: true,
	            handler: function(){
	            	Ext.dispatch({
                         controller: synchronicity.controllers.contact,
                         action: 'showContactForm',
                         component: panelObject.list,
                         mode: 'add'
                     });
	            }					            
	        });
		 this.navigationBarItems = [{xtype: 'spacer'}, this.addIcon, this.searchIcon];
		 return this.navigationBarItems;
	 },
	 
	 
	 initialize: function() {
		 Ext.dispatch({
	            controller: synchronicity.controllers.contact,
	            action: 'initializeContactList'
	        }); 
	 }
});



