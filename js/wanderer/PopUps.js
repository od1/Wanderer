/* Author:
od1_fr
*/

var PopUps = Proto.extend({
	
	
	// Properties
	
	
	
	// Constructor
	
	constructor: function()
	{
		
	},
	
	
	// method
	
	getPopUpContent: function (feature, closeBoxCallback)
	{
		console.log("getPopUpContent");
		console.log(feature);
		var content;
	    if(feature.attributes.type == "emotion"){
			popUpTitle = "tag";
			content = "<h2>User "+feature.attributes.author + "</h2>" 
					+ "<p>" + feature.attributes.date + "</p>" 
					+ "<p>Excitement: " + feature.attributes.excitement + ", value: " + feature.attributes.value;
		} else if (feature.attributes.type == "My position Accuracy"){
			popUpTitle = "editor";
			content = "<h2>How do you feel?</h2>"
						+"<table class='emotionsTable'><tr>"
						+		"<td><img src='img/00_10.png' alt='serene'/></td>"
						+		"<td><img src='img/05_10.png' alt='happy'/></td>"
						+		"<td><img src='img/10_10.png' alt='euphoric'/></td>"
						+	"</tr><tr>"
						+		"<td><img src='img/00_05.png' alt='calm'/></td>"
						+		"<td><img src='img/05_05.png' alt='neutral'/></td>"
						+		"<td><img src='img/10_05.png' alt='excited'/></td>"
						+	"</tr><tr>"
						+		"<td><img src='img/00_00.png' alt='melancolic'/></td>"
						+		"<td><img src='img/05_00.png' alt='sad'/></td>"
						+		"<td><img src='img/10_00.png' alt='angry'/></td>"
						+	"</tr></table>"
		}
		// Since the data is user-generated, do naive protection against Javascript.
	    if(content) {
			if (content.search("<script") != -1) {
		        content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
		    } 
			return(
				new OpenLayers.Popup.FramedCloud(
					popUpTitle, 
					feature.geometry.getBounds().getCenterLonLat(),
					new OpenLayers.Size(100,100),
					content,
					null, true, closeBoxCallback
				)
			);
		} else {
			return undefined;
		}
	}
});

extend(PopUps, Eventable);