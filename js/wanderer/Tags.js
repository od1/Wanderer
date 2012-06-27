/* Author:
od1_fr
*/

var Tags = Proto.extend({
	
	
	// Properties
	
	
	// Constructor
	
	constructor: function()
	{
		console.log("constructor of Tags");
		
		
	},
	
	
	// Load JSON, transform it and add it to a GeoJSON layer, args are the layer
	
	getGeoJSONfromDBaddGeoJSONTagsLayer: function(tagsLayer)
	{
		console.log("getGeoJSONfromDB");
		console.log(this);
		$.getJSON('https://api.mongolab.com/api/1/databases/emotions/collections/FeatureCollection?apiKey=4fd8b749e4b0aedd849737fc', 
			function(data) 
			{ 
				var geoJSON = {
					// lil hack to have a valid GeoJSON string..
				    "_id": {
				        "$oid": "4fd8c766e4b0aedd84973825"
				    },
				    "type": "FeatureCollection",
				    "features": data
				};
				this.addGeoJSONTagsLayer(tagsLayer, geoJSON)
			}.bind(this)
		);
	},
	
	
	// Add a GeoJSON layer, args are the layer and the GeoJSON
	
	addGeoJSONTagsLayer: function (tagsLayer, geoJSON) 
	{
		console.log("addGeoJSONTagsLayer");
		console.log(geoJSON);
	    var geojson_format = new OpenLayers.Format.GeoJSON({
		                          internalProjection: new OpenLayers.Projection("EPSG:900913"),
		                          externalProjection: new OpenLayers.Projection("EPSG:4326")
		});
	
		// styling stuff
		var style = new OpenLayers.Style(
			{
				graphicWidth : 29,
				graphicHeight : 41,
				graphicOpacity : 1,
				graphicXOffset : -15,
				graphicYOffset : -40,
				externalGraphic : "${url}"
			},{
			context: {                               
		        url: function(feature) {
					var url = "img/05_05.png";
					if(feature.name != "myPositionLayer") {
						var e;
						if(feature.attributes.excitement == 0) {
							e = "00";
						} else if(feature.attributes.excitement == 0.5) {
							e = "05";
						} else if(feature.attributes.excitement == 1) {
							e = "10";
						}
						var v;
						if(feature.attributes.value == 0) {
							v = "00";
						} else if(feature.attributes.value == 0.5) {
							v = "05";
						} else if(feature.attributes.value == 1) {
							v = "10";
						}
						url = "img/"+e+"_"+v+".png";
					}
					return url;
		        }
		    }				
		});
	
		var StyleMap = new OpenLayers.StyleMap({'default': style});
		tagsLayer.styleMap = StyleMap;
		// End of styling stuff
		
	    tagsLayer.addFeatures(geojson_format.read(geoJSON));
	    console.log("tags added to tag layer");
	},
	
});

extend(Tags, Eventable);