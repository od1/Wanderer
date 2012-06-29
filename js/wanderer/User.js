/* Author:
od1_fr
*/

var User = Proto.extend({
	
	
	// Properties
	
	id: undefined,
	
	
	// Constructor
	
	constructor: function()
	{
		this.identification();
	},
	
	
	// try to find out if the user exists
	
	identification: function () 
	{
		this.id = this.getCookies();
	},
	
	
	// check in cookies 
	// /!\ wont work in app
	
	getCookies: function () 
	{
		// check cookies
		if ($.cookie("user"))
		{
			console.log("cookie exists, user id:", $.cookie("user"));
			return $.cookie("user")
		} 
		// the cookie doesn't exists
		else {
			// if no cookies, try to write one
			console.log("no cookies");
			if($.cookie("user", this.getUniqueId()))
			{
				// return the new writen cookie content
				console.log("cookie created, user id:", $.cookie("user"));
				return $.cookie("user")
			} 
			// impossible to write a cookie
			else {
				console.log("impossible to write a cookie");
				return false;
			}
		};
	},
	
	
	// get unique ID for a new user
	
	getUniqueId: function ()
	{
	     var dateObject = new Date();
	     var uniqueId = 
	          dateObject.getFullYear() + '' + 
	          dateObject.getMonth() + '' + 
	          dateObject.getDate() + '' + 
	          dateObject.getTime();
	
	     return uniqueId;
	},
	
});

extend(User, Eventable);