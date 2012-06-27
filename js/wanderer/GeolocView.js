/* Author:
od1_fr
*/

var GeolocView = Proto.extend({
	
	
	// Properties
	
	layer: undefined,
	point: undefined,
	centerGraphic: undefined, 
	accuracyGraphic: undefined,
	
	/** 
	** Constructor
	** layer: Vector
	** 
	**/
	
	constructor: function(_layer) 
	{
		console.log("constructor of geolocView");
		this.layer = _layer;
	},
	
	
	updateGraphic: function(_point, _accuracy)
	{
		this.point = _point;
		this.accuracy = _accuracy;
		
		if(this.centerGraphic != undefined) {
			this.layer.removeFeatures([this.rangeGraphic, this.centerGraphic]);
		};
		
		this.drawCenterGraphic();
		this.drawAccuracyGraphic();
	},
	
	
	// draw center graphics
	
	drawCenterGraphic: function() 
	{
		this.centerGraphic = new OpenLayers.Feature.Vector(
		    this.point,
		    {
		    	"type": "My Geolocation",
				"excitement": null, 
				"value": null,
				"date": null, 
				"author": null},
		    {
		        graphicName: 'circle',
		        strokeColor: '#229',
		        strokeWidth: 1,
		        strokeOpacity: 0.7,
		        fillOpacity: 0.5,
		        fillColor: '#44F',
		        pointRadius: 10,
		    }
		)
		this.layer.addFeatures([this.centerGraphic]);
	},
	
	
	// draw accuracy graphics
	
	drawAccuracyGraphic: function() 
	{
		this.accuracyGraphic = new OpenLayers.Feature.Vector(
		    OpenLayers.Geometry.Polygon.createRegularPolygon(
		        new OpenLayers.Geometry.Point(this.point.x, this.point.y),
		        this.accuracy/2,
		        40,
		    	0
		    ),
		    {
		    	"type": "My position Accuracy",
				"excitement": null, 
				"value": null,
				"date": null, 
				"author": null},
		    {
		    	fillColor: '#222299',
		    	fillOpacity: 0.1,
		   		strokeWidth: 0
		    }
		);
		this.layer.addFeatures([this.accuracyGraphic]);
		this.dispatchEvent("GraphicsDrawn");
	},
	
	
	// Animate the range circle 
	
	/// BUGGY! ///
	
	pulsate: function(feature) 
	{
		var point = feature.geometry.getCentroid(),
		    bounds = feature.geometry.getBounds(),
		    radius = Math.abs((bounds.right - bounds.left)/2),
		    count = 0,
		    grow = 'up';
	
		var resize = function(){
		    if (count>16) {
		        clearInterval(window.resizeInterval);
		    }
		    var interval = radius * 0.03;
		    var ratio = interval/radius;
		    switch(count) {
		        case 4:
		        case 12:
		            grow = 'down'; break;
		        case 8:
		            grow = 'up'; break;
		    }
		    if (grow!=='up') {
		        ratio = - Math.abs(ratio);
		    }
		    feature.geometry.resize(1+ratio, point);
		    circlePulsate = feature;
			dataLayer.drawFeature(circlePulsate);
		    count++;
		};
		window.resizeInterval = window.setInterval(resize, 50, point, radius);
	}
});

extend(GeolocView, Eventable);