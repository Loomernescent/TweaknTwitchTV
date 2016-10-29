



// $( document ).ready(function() {

	var losers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	var model = {
		getData: function(query) {		
			for (var i = 0; i < losers.length; i++) {
				model.getSearch(losers[i], query);
			}				
		},
		getSearch: function(search, query) {
			console.log(query)		
			$.ajax({
				type: "GET",
				url: 'https://api.twitch.tv/kraken/streams/' + search ,
				headers: {
				"Client-ID": "56xe1jteqiv0bnmryzvols9c6bru51i"
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (errorThrown == "Not Found") {
						my.viewModel.addLusers(errorThrown, search);	
					} else {
						my.viewModel.addLusers("Sorry an error has occurred", search)
					}
				},
				// dataFilter: function(data) {
				//     var data = JSON.parse(data);
				//     // console.log(data)
				//     // delete data.redirect;
				//     return JSON.stringify(data);
				// },
				success: function(data){
					console.log(query);
					// return on
					if(query === "On") {
						if(data.stream !== null) {
							my.viewModel.addLusers(data, search);							
						}
					// return off
					} else if(query === "Off") {
						if(data.stream === null) {
							my.viewModel.addLusers(data, search);							
						}
					//return all
					} else {
						my.viewModel.addLusers(data, search);						
					}

				}
			});
		}
	}

	function Geek(name, logo, link, followers, status) {

		var self = this;
		self.name = name;
		self.logo = logo;
		self.link = "http://player.twitch.tv/?channel=" + name; // this needs adjustment
		self.followers = followers;
		self.status = status;

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

	function Sprite(x, y) {
		this.index = 1;
		this.count = 1;
		this.x = x;
		this.y = y;
		this.imgWidth = 840;
		this.imgHeight = 166; // maybe not needed? 
		this.xpos = 0;
		this.ypos = 0;
		this.numFrames = 4;
		this.frameSize = 210;
		this.reverse = false;
		this.draw();
	};

	Sprite.prototype.draw = function() {
            //multiplying by -1 because we want to move the image to the left and up to reveal the area we want to see.
            var animHtml = '<div class="sprite tweak"></div>';
			this.animElement = $(animHtml);    
			this.animElement.css({
				"background-image": 'url("img/Tweak_SpriteSheet.png")', //' linear-gradient(90deg, rgba(170,87,69, 0) 0%,  #aa5745 35%)', 
				backgroundPosition: (-this.xpos)+"px "+(-this.ypos)+"px",
				width: this.frameSize,
				height: this.imgHeight,
				position: "absolute",
				left: this.x,
				top: this.y
			});
			$(".texture-normal").append(this.animElement);        	

		}

	Sprite.prototype.animate = function() {
           this.animElement.css({
            	backgroundPosition: (-this.xpos)+"px "+(-this.ypos)+"px"
            });  
            //each time around we add the frame size to our xpos, moving along the source image.
            this.xpos += this.frameSize;
            //increase the index so we know which frame of our animation we are currently on.
            this.index = this.index + this.count;
            //if our index is higher than our total number of frames, we're at the end and better start over.
	            if(this.index >= this.numFrames) {
	            //	console.log("reversed");
	            	this.reverse = true;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    } else if (this.index <= 1) {
	            //	console.log("un-reversed");			    	
			    	this.reverse = false;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    }
		}



	//Will receive the result of all client authorizations: either an access token or a failure message. This must exactly match the redirect_uri parameter passed to the authorization endpoint. 
	// When testing locally, you can set this to http://localhost.

	// https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=56xe1jteqiv0bnmryzvols9c6bru51i&redirect_uri=http://localhost
	         


	var clientID = "56xe1jteqiv0bnmryzvols9c6bru51i";


	function AppViewModel() {
		var self = this;
		self.timer = setInterval(function() {
				tweak.animate();
		}, 140);

		self.lusers = ko.observableArray();


		self.addLusers = function(response, search) {
			console.log(response);
			// console.log(query + " " + search);		
				var name = search;
			if(response !== "Not Found" && response !== "Sorry an error has occurred") {
				var link = response["_links"]["channel"];
				// console.log(response.stream);

			    if (response.stream !== null) {
					var status = "online";
					var logo = response.stream.channel.logo;
					var followers = "Fol: " + response.stream.channel.followers;	
					self.lusers.push(new Geek(name, logo, link, followers, status));	
				} else {
					var status = "offline";
					self.lusers.push(new Geek(name, null, link, null, status));
				}			
			} else {
				var status = response;
				self.lusers.push(new Geek(name, null, null, null, status));
			}
			clearInterval(my.viewModel.timer);
			tweak.animElement.css({
				backgroundPosition: 0 +"px "+ 0 +"px"
			});
			console.dir(tweak);
		}
			
		self.update = function(data, event) {
			self.lusers.splice(0, self.lusers().length);
			console.dir(event.target.text);
			model.getData(event.target.text);
			self.timer = setInterval(function() {
				tweak.animate();
			}, 140);


			
		}

		// self.on = function(data, event) {
		// 	model.getData(event.target.text);
		// 	// self.lusers.splice(0, self.lusers().length);
		// 	// model.getData(event.target.text);
		// 	var newArr = self.lusers().filter(function(elem){
		// 		return elem.status === "online";
		// 	})
		// 	console.log(newArr);

		// }

		self.search = function() {
			self.lusers.splice(0, self.lusers().length);
			model.getSearch($('.search').val(), "All");
		}

	}

	my = { viewModel: new AppViewModel() };
	ko.applyBindings(my.viewModel);

	var tweak = new Sprite(0, 30);
    
	model.getData("All");
	// setInterval(function() {

	// 	tweak.animate();

	// }, 140);

// });

