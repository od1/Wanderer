/* Author:
od1_fr
*/

var lon = 5;
var lat = 40;
var zoom = 5;
var options, map, select;
var dataLayer = new OpenLayers.Layer.Vector();
var myPosition = new OpenLayers.LonLat(13.428572, 52.499649);

$(document).ready(init());

function init(){
	
	//
	if(addMapLayer()) {
		
		map.addLayer(dataLayer);
		
		if(addGeoloc()){
			
			$.getJSON('https://api.mongolab.com/api/1/databases/emotions/collections/FeatureCollection?apiKey=4fd8b749e4b0aedd849737fc', 
				function(data){
					addGeoJSONDataLayer(data);
				});
			selectManager(dataLayer);
			mapZoomUpdate("geoloc");
			
		} else {
			console.log("Couldn't add geolocation")
		}
	} else {
		console.log("Couldn't add map layer")
	}
}
/**
* map layer
**/

function addMapLayer() {
	
    options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    };
    map = new OpenLayers.Map('map', options);
    var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap (Mapnik)");
    
	map.addLayer(mapnik);
	return(true)
}

function mapZoomUpdate(p) {
	console.log("update position: "+p)
	if(p == "geoloc") {
		var bounds = new OpenLayers.Bounds();
		bounds.extend(myPosition);
        map.zoomToExtent(bounds.transform(map.displayProjection, map.projection));
        //map.zoomTo(15);
		
	} else {
		
		map.zoomToExtent(
		    new OpenLayers.Bounds(
		        68.774414, 11.381836, 123.662109, 34.628906
		    ).transform(map.displayProjection, map.projection)
		);
	}
}


/**
* data layer
**/

function addGeoJSONDataLayer(json) {
	
	json2 = {
	    "_id": {
	        "$oid": "4fd8c766e4b0aedd84973825"
	    },
	    "type": "FeatureCollection",
	    "features": json
	};
	
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

	dataLayer.styleMap = StyleMap;
	// End of styling stuff */
    dataLayer.addFeatures(geojson_format.read(json2));
	map.addLayer(dataLayer);
};

/**
* selection
**/

function selectManager(feat) {
   	select = new OpenLayers.Control.SelectFeature(feat);
	feat.events.on({
	    "featureselected": onDataFeatureSelect,
	    "featureunselected": onDataFeatureUnselect
	});
	map.addControl(select); 
	
	select.activate();
}

function onDataPopupClose(evt) {
    select.unselectAll();
}
function onDataFeatureSelect(event) {
    var feature = event.feature;
	console.log(feature)
	if(!feature.popup) {
		openPopUp(feature);
	}
}
function onDataFeatureUnselect(event) {
    var feature = event.feature;
	console.log(feature)
    if(feature.popup) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        delete feature.popup;
    }
}

/**
* popups
**/
function openPopUp(feature){
	var content;
    if(feature.attributes.type == "emotion"){
		popUpTitle = "tag";
		content = "<h2>User "+feature.attributes.author + "</h2>" 
				+ "<p>" + feature.attributes.date + "</p>" 
				+ "<p>Excitement: " + feature.attributes.excitement + ", value: " + feature.attributes.value;
	} else if (feature.attributes.type == "newposition"){
		popUpTitle = "editor";
		content = "<h2>How do you feel?</h2>"
					+"<table class='emotionsTable'><tr>"
					+		"<td><a href='#' onclick='addEmotionTag(0, 1)'><img src='img/00_10.png' alt='serene'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(0.5, 1)'><img src='img/05_10.png' alt='happy'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(1, 1)'><img src='img/10_10.png' alt='euphoric'/></a></td>"
					+	"</tr><tr>"
					+		"<td><a href='#' onclick='addEmotionTag(0, 0.5)'><img src='img/00_05.png' alt='calm'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(0.5, 0.5)'><img src='img/05_05.png' alt='neutral'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(1, 0.5)'><img src='img/10_05.png' alt='excited'/></a></td>"
					+	"</tr><tr>"
					+		"<td><a href='#' onclick='addEmotionTag(0, 0)'><img src='img/00_00.png' alt='melancolic'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(0.5, 0)'><img src='img/05_00.png' alt='sad'/></a></td>"
					+		"<td><a href='#' onclick='addEmotionTag(1, 0)'><img src='img/10_00.png' alt='angry'/></a></td>"
					+	"</tr></table>"
	}
	// Since the data is user-generated, do naive protection against Javascript.
    if(content) {
		if (content.search("<script") != -1) {
	        content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
	    } else {
			var popup = new OpenLayers.Popup.FramedCloud(popUpTitle, 
		                             					feature.geometry.getBounds().getCenterLonLat(),
		                             					new OpenLayers.Size(100,100),
		                             					content,
		                             					null, true, onDataPopupClose);
		    feature.popup = popup;
		    map.addPopup(popup);
		}
	}
}

/**
* Geoloc init
**/

function addGeoloc() {

	// Geolocation browser settings
	
	var geolocate = new OpenLayers.Control.Geolocate({
	    bind: false,
	    geolocationOptions: {
	        enableHighAccuracy: false,
	        maximumAge: 0,
	        timeout: 7000
	    }
	});
	
	// Geolocation style and visual effects
	
	var firstGeolocation = true;
	var circle1, circle2, circlePulsate;
	
	var myPositionStyle = {
	    fillColor: '#222299',
	    fillOpacity: 0.1,
	    strokeWidth: 0
	};

	var pulsate = function(feature) {
		
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
	};
	
	// Geolocation events
	
	geolocate.events.register("locationupdated", geolocate, function(e) {
		console.log("location updated")
	    if(circle1 != undefined) {
			dataLayer.removeFeatures([circle2, circle1]);
		}
		if(circlePulsate != undefined) {
			dataLayer.removeFeatures([circlePulsate]);
		}
		
		circle1 = new OpenLayers.Feature.Vector(
	        OpenLayers.Geometry.Polygon.createRegularPolygon(
	            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
	            e.position.coords.accuracy/2,
	            40,
	            0
	        ),
	        {"type": "newpositionAccuracy",
	 		 "excitement": null, 
			 "value": null,
	  		 "date": null, 
	  		 "author": null},
	        myPositionStyle
	    );
			
		circle2 = new OpenLayers.Feature.Vector(
	        e.point,
	        {"type": "newposition",
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
		dataLayer.addFeatures([circle1, circle2]);
	
		myPosition.lon = e.position.coords.longitude;
		myPosition.lat = e.position.coords.latitude;
		
		if (firstGeolocation) {
			//pulsate(circle1); // doesn't work
		    firstGeolocation = false;
		    //this.bind = true;
			mapZoomUpdate("geoloc");
			// open popup
			select.onUnselect = function () { console.log("circle unselect"); }
			select.toggle = true;
			select.select(circle2);
		}
	});
	
	geolocate.events.register("locationfailed",this,function() {
	    OpenLayers.Console.log('Location detection failed');
	});
	
	map.addControl(geolocate);

	geolocate.watch = false;
	geolocate.bind = false;
	geolocate.activate();
	return(true)
}

/**
* Save data 
**/

function addEmotionTag(excitement, value){
	
	var d = new Date();
	
	var newFeature = { 	
		"type": "Feature",
		"geometry": {"type": "Point", "coordinates": [myPosition.lon, myPosition.lat]},
		"properties": {
	  		 "type": "emotion",
			 "excitement": excitement, 
			 "value": value,
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












