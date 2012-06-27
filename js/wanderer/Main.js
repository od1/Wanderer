/* Author:
od1_fr
*/

var Main = Proto.extend({
	
	
	// Properties
	
	
	// Constructor
	
	constructor: function()
	{
		this.mapManager = MapManager.new();
		this.datasManager = DatasManager.new();
		
		this.mapManager.addEventListener("NewTag", this.datasManager.addNewTag);
	},
	
	
	// method
	
});

extend(Main, Eventable);

$(document).ready(Main.new());