/* Author:
od1_fr
*/

var MapManager = Proto.extend({
	
	
	// Properties
	
	dataUrl: undefined,
	map: undefined,
	options : 
	{
	    projection: new OpenLayers.Projection("EPSG:900913"),
	    displayProjection: new OpenLayers.Projection("EPSG:4326")
	},
	
	geolocManager: undefined,
	geolocView: undefined,
	geolocViewLayer: undefined,
	
	tags: undefined,
	tagsLayer: undefined,
	
	selectionManager: undefined,
	
	
	// Constructor
	
	constructor: function(_dataUrl)
	{
		this.dataUrl = _dataUrl;
		this.map = new OpenLayers.Map('map', this.options);
		var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap (Mapnik)");
		
		this.map.addLayer(mapnik);
		
		
		// Activate Geolocation
		
		this.geolocManager = GeolocManager.new(this);
		
		this.geolocViewLayer = new OpenLayers.Layer.Vector();
		this.map.addLayer(this.geolocViewLayer);
		this.geolocView = GeolocView.new(this.geolocViewLayer);
		
		this.geolocManager.addEventListener("geolocUpdated", this.geolocUpdated.bind(this));
		this.geolocManager.init();
		
		this.map.addControl(this.geolocManager.geolocate);
		
		
		// Activate Tags
		
		this.tagsLayer = new OpenLayers.Layer.Vector();
		this.tagsLayer.events.register("added", this.tagsLayer, function()
			{ 
				this.tags = Tags.new(this.dataUrl);
				this.tags.getGeoJSONfromDBaddGeoJSONTagsLayer(this.tagsLayer);
			}.bind(this)
		);
		this.map.addLayer(this.tagsLayer);
		
		
		// add selection control
		
		this.selectionManager = SelectionManager.new(this.map, [this.geolocViewLayer, this.tagsLayer]);
		this.selectionManager.addEventListener("NewTag", function (e)
			{
				e.lon = this.geolocManager.position.coords.longitude;
				e.lat = this.geolocManager.position.coords.latitude;
				this.dispatchEvent("NewTag", e);
			}.bind(this)
		);
		
		
		// Select my positon to open the popup on load
		
		this.geolocView.addEventListener("GraphicsDrawn", function (e)
			{
				this.selectionManager.selectFeature(this.geolocView.accuracyGraphic);
			}.bind(this)
		);
	},
	
	
	// Center the map on lonLat: an OpenLayers lonLat object
	
	reFocus: function(lonLat)
	{
		console.log("reFocus");
		var bounds = new OpenLayers.Bounds();
		bounds.extend(lonLat);
		this.map.zoomToExtent(bounds.transform(this.options.displayProjection, this.options.projection));
	},
	
	
	// when geolocation is updated
	
	geolocUpdated: function(e) 
	{
		console.log("geolocUpdated in MapManager")
		if(this.geolocManager.firstGeoloc){
			// center the map on my geolocaiton
			parent.reFocus(new OpenLayers.LonLat(this.geolocManager.position.coords.longitude, this.geolocManager.position.coords.latitude));
			this.geolocManager.firstGeoloc = false;
		};
		parent.geolocView.updateGraphic(this.geolocManager.point, this.geolocManager.position.coords.accuracy);
	}
});

extend(MapManager, Eventable);