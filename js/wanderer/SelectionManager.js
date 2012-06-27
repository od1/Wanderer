/* Author:
od1_fr
*/

var SelectionManager = Proto.extend({
	
	
	// Properties
	
	selectControl: undefined,
	map: undefined,
	popUps: undefined,
	
	// Constructor
	
	constructor: function(_map, _features)
	{
		this.map = _map;
		
		this.popUps = PopUps.new();
		console.log("add selection control")
		this.selectControl = new OpenLayers.Control.SelectFeature(
		    _features,
		    {
		        clickout: true, toggle: false,
		        multiple: false, hover: false
		    }
		);
		this.map.addControl(this.selectControl);
		this.selectControl.activate();
		
		for(var i=0; i<_features.length; i++)
		{
			_features[i].events.on({
			    "featureselected": this.onDataFeatureSelect.bind(this),
			    "featureunselected": this.onDataFeatureUnselect.bind(this)
			});
		};
	},
	
	
	//
	
	selectFeature : function (feat)
	{
		this.selectControl.select(feat);
	},
	
	
	//
	
	openPopUp: function (feature) 
	{
		feature.popup = this.popUps.getPopUpContent(feature, this.onDataPopupClose.bind(this));
		this.map.addPopup(feature.popup);
		
		// detect the click on the emotion table
		
		$('td').click(function(e){ 
			var colIndex = $(e.currentTarget).prevAll().length;
			var rowIndex = $(e.currentTarget).parent('tr').prevAll().length;
			//console.log( colIndex / 2, 1 - rowIndex / 2 );
			this.dispatchEvent("NewTag",{ excitement: colIndex / 2, value: 1 - rowIndex / 2 });
		}.bind(this));
	},
	
	
	// 
	
	onDataPopupClose: function (evt) 
	{
		
	    this.selectControl.unselectAll();
	},
	
	onDataFeatureSelect: function (event) 
	{
	    var feature = event.feature;
	    console.log("onDataFeatureSelect")
		console.log(feature)
		if(!feature.popup) {
			this.openPopUp(feature);
		}
	},
	
	onDataFeatureUnselect: function (event) 
	{
	    var feature = event.feature;
	    console.log("onDataFeatureUnselect")
		console.log(feature)
	    if(feature.popup) {
	        this.map.removePopup(feature.popup);
	        feature.popup.destroy();
	        delete feature.popup;
	    }
	}
});

extend(SelectionManager, Eventable);