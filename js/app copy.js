var losers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];





var model = {
	accounts: null,
	getData: function(query) {
	$.getJSON('../data/twitchData.json', function (response) {
	    my.viewModel.updateLusers(response, query);
	  }); // end getJSON
	  return;	
}
}


function Geek(name, logo, link, followers, status) {

	var self = this;
	self.name = name;
	self.logo = logo;
	self.link = link;
	self.followers = followers;
	if(status === true) {
		self.status = "online";	
	} else if(status === 404) {
		self.status = "404";
	} else {
		self.status = "offline";
	}
	self.ledIndicator = ko.computed(function(){
		if(self.status === "online") {
			return "green";
		} else if (self.status === "offline"){
			return "grey";
		} else {
			return "error";
		}
	});
	
}



//Will receive the result of all client authorizations: either an access token or a failure message. This must exactly match the redirect_uri parameter passed to the authorization endpoint. 
// When testing locally, you can set this to http://localhost.

var clientID = "56xe1jteqiv0bnmryzvols9c6bru51i";

// var request = new XMLHttpRequest();
// request.open('GET', 'https://api.twitch.tv/kraken/streams/freecodecamp?callback=?', true);

// request.onload = function() {
//   if (this.status >= 200 && this.status < 400) {
//     // Success!
//     var data = JSON.parse(this.response);
//   } else {
//     // We reached our target server, but it returned an error

//   }
// };

// request.onerror = function() {
//   // There was a connection error of some sort
// };

// request.send();

// $.getJSON('https://api.twitch.tv/kraken/streams/ESL_SC2?callback=?', function(data) {
//   console.log(data);
// });

function AppViewModel() {
	var self = this;

	self.lusers = ko.observableArray();

	// self.displayLusers = ko.computed(function(){
	// 	return self.lusers
	// })
		

	// self.lusersFilter = function(arr) {
	// 	return arr.filter(function(elem){
	// 		return elem.status === "online";
	// 	})
	// }

	self.updateLusers = function(response, query){
		// empty lusers array		
		self.lusers.splice(0, self.lusers().length);

		//filter lusers array as per query 
		if(query === "On") {
			console.log("filter On" )
			var lusersList = response.filter(function(elem){
				console.log(elem.stream)
				return elem.stream !== null && elem.status !== 404;
			});			
		} else if (query === "Off") {
			var lusersList = response.filter(function(elem){
				console.log(elem.stream)
				return elem.stream === null;
			});				
		} else {
			var lusersList = response;
		}
		// re populate luser list;		
		$.each(lusersList, function(index, luserEntry){
			if (luserEntry.hasOwnProperty('stream')) {				
				var link = luserEntry["_links"]["channel"];
				if (luserEntry.stream !== null) {
					var name = luserEntry.stream["display_name"];
					var status = true;				
					var logo = luserEntry.stream.logo;				
					var followers = luserEntry.stream.followers;
									
				} else {
					var name = luserEntry["display_name"];
					var status = null;
					var logo = null;
					var followers = null;
					new Geek(name, logo, link, followers, status)
				}
				self.lusers.push(new Geek(name, logo, link, followers, status));
			} else {
				self.lusers.push(new Geek("Error account not found", null, null, null, 404));
			}
		})
	} 

	self.update = function(data, event) {
		console.dir(event.target.text);
		model.getData(event.target.text);
	}

}

// var viewModel = ko.applyBindings(new AppViewModel());
my = { viewModel: new AppViewModel() };
ko.applyBindings(my.viewModel);
model.getData("All");


// https://api.twitch.tv/kraken?callback=twitchResponse