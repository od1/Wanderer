/* Author:
od1_fr
*/

var DatasManager = Proto.extend({
	
	
	// Properties
	
	prop: undefined,
	
	
	// Constructor
	
	constructor: function()
	{
		
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
		  		 "author": "default"
		  		}
			}
		
		$.ajax( { url: "https://api.mongolab.com/api/1/databases/emotions/collections/FeatureCollection?apiKey=4fd8b749e4b0aedd849737fc",
			      data: JSON.stringify(newFeature),
			      type: "POST",
			      contentType: "application/json" } );
		
		$("#editor_contentDiv").html("<h2>Your feelings have been recorded.</h2><p><a href='' onclick='location.reload();'>Reload this page</a> to see it on the map.</p>");
	}
});

extend(DatasManager, Eventable);