/* Author:
od1_fr
*/

var GeolocManager = Proto.extend({
	
	
	// Properties
	
	geolocate: undefined,
	position: undefined,
	point: undefined,
	parent: undefined,
	firstGeoloc: true,
	
	
	// Constructor
	
	constructor: function(_parent)
	{
		parent = _parent;
	},
	
	
	init: function()
	{
		// Create the géolocation control with some options for the browser
		this.geolocate = new OpenLayers.Control.Geolocate({
		    bind: false,
		    watch: true,
		    geolocationOptions: {
		        enableHighAccuracy: false,
		        maximumAge: 0,
		        timeout: 7000
		    }
		});
		// activate the géolocation control and add some events on it
		if(this.geolocate.activate()){
			this.geolocate.events.register("locationupdated", this.geolocate, this.locationUpdated.bind(this));
			this.geolocate.events.register("locationfailed", this.geolocate, this.geolocationFailed);
		} else {
			console.log("Geolocation activation impossible");
		};
	},
	
	
	// when geolocation is updated
	
	locationUpdated: function(e)
	{
		console.log("locationUpdated");
		// save the position (the browser.geolocation.position native object) and the ‘point’: the location transformed in the current map projection
		this.position = e.position;
		this.point = e.point;
		this.dispatchEvent("geolocUpdated");
	},
	
	
	// when geolocation fails
	
	geolocationFailed: function(e)
	{
		console.log("Geolocation Failed");
		dispatchEvent("geolocFailed");
	}
});

extend(GeolocManager, Eventable);