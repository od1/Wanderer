/* Author:
od1_fr
*/

var DatasManager = Proto.extend({
	
	
	// Properties
	
	url: undefined,
	user: "unknown",
	
	
	// Constructor
	
	constructor: function(_url, _user)
	{
		this.url = _url;
		this.user = _user;
	},
	
	
	// method
	
	addNewTag: function (e)
	{
		console.log("addNewTag");
		console.log(e);
		var d = new Date();
		
		var newFeature = { 	
			"type": "Feature",
			"geometry": {"type": "Point", "coordinates": [e.lon, e.lat]},
			"properties": {
		  		 "type": "emotion",
				 "excitement": e.excitement, 
				 "value": e.value,
		  		 "date": d.toUTCString(), 
		  		 "author": this.user
		  		}
			}
		
		$.ajax( { url: this.url,
			      data: JSON.stringify(newFeature),
			      type: "POST",
			      contentType: "application/json" } );
		
	}
});

extend(DatasManager, Eventable);