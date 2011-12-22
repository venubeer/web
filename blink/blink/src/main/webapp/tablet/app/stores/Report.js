Ext.regModel('synchronicity.stores.Report', {fields: ['name', 'desc', 'url']});
synchronicity.stores.reports = new Ext.data.JsonStore({
		    model  : 'synchronicity.stores.Report', 
		    data: [{name: 'My Dashboards', 
					description: 'An array of dashboards that are based on both Siebel and non-Siebel subject areas.',
					url: '/blink/auth/login'
					},
					{name: 'Forecast Report By GP', 
					 description: 'Report displays forecast data using BVAs and future opportunity revenue.',
					 url: 'http://webapps.inbaxter.com/ssor/secured/GenerateUI?custom.report.report.name=R3B%3AForecastReportByGP&Division=@@@Division@@@&Position=@@@Position@@@&Sales+Position=@@@Position@@@&Product+Criteria=1&Probability=0&Focus+Account+Criteria=%'
					},
					{name: '30-60-90 By Days to Close', 
					 description: 'Report displays forecast data that are expected to close in 30, 60 and 90 days.',
					 url: 'http://webapps.inbaxter.com/ssor/secured/GenerateUI?custom.report.report.name=R3B%3A30-60-90-ByCloseDate&Division=@@@Division@@@&Position=@@@Position@@@&Sales%20Position=@@@Position@@@&Days%20To%20Close=0&Product%20Criteria=1&Product%20Level=4'
					}
				  ]
		});	