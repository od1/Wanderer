/* Author:
od1_fr
*/

var Main = Proto.extend({
	
	
	// Properties
	
	// url of the mongo json database
	dataUrl: "https://api.mongolab.com/api/1/databases/emotions/collections/FeatureCollection?apiKey=4fd8b749e4b0aedd849737fc",
	
	// Constructor
	
	constructor: function()
	{
		this.user = User.new();
		this.mapManager = MapManager.new(this.dataUrl);
		this.datasManager = DatasManager.new(this.dataUrl, this.user);
		
		this.mapManager.addEventListener("NewTag", this.datasManager.addNewTag);
	},
	
	
	// method
	
});

extend(Main, Eventable);

$(document).ready(Main.new());