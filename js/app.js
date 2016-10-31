



$( document ).ready(function() {

	var losers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	var tweakTimer; 

	// returns timer to tweakTimer to start and stop animation
	var timer = function() {
		return setInterval(function() {
				// console.log(tweak.cycle)
				if(tweak.cycle < 8) {
					tweak.animate();	
				} else {
					tweak.stop();
				}				
		}, 140);		
	}

	function Sprite(x, y) {
		this.cycle = 0;
		this.index = 1;
		this.count = 1;
		this.x = x;
		this.y = y;
		this.imgWidth = 840;
		this.imgHeight = 166; 
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
				"background-image": 'url("img/Tweak_SpriteSheet.png")',  
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
	            	this.reverse = true;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    } else if (this.index <= 1) {		    	
			    	this.reverse = false;
	                this.count *= -1; 
	                this.frameSize *= -1;
			    }
			this.cycle++;
		}

	Sprite.prototype.stop = function() {
		clearInterval(tweakTimer);
		this.cycle = 0;
		this.index = 1;
		this.animElement.css({
			backgroundPosition: 0 +"px "+ 0 +"px"
		});

	}

	// Geek / Twitcher Constructor
	function Geek(name, logo, link, followers, status) {

		var self = this;
		self.name = name;
		self.logo = logo;
		if(link !== null) {
			self.link = "http://player.twitch.tv/?channel=" + name; // this needs adjustment			
		} else {
			self.link = "https://www.twitch.tv/";
		}

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

	// Data/Model Object
	var model = {
		getData: function(query) {		
			for (var i = 0; i < losers.length; i++) {
				model.getSearch(losers[i], query);
			}				
		},
		getSearch: function(search, query) {
			// console.log(query)		
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
				success: function(data){
					// console.log(query);
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


	// Knockout View Model
	function AppViewModel() {
		var self = this;

		self.lusers = ko.observableArray();

		self.safeObservable = function(initialValue) {
		  var result = ko.observable(initialValue);
		  result.safe = ko.dependentObservable(function() {
		    return result() || {};
		  });

		  return result;
		};

		self.addLusers = function(response, search) {	
			var name = search;
			if(response !== "Not Found" && response !== "Sorry an error has occurred") {
				var link = response["_links"]["channel"];

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
		}
			
		self.update = function(data, event) {
			self.lusers.splice(0, self.lusers().length);
			model.getData(event.target.text);
			tweakTimer = timer();		
		}

		self.search = function() {
			self.lusers.splice(0, self.lusers().length);
			model.getSearch($('.search').val(), "All");
			tweakTimer = timer();
		}

	}

	// put viewModel into var my so its accessable from the console
	var my = { viewModel: new AppViewModel() };
	ko.applyBindings(my.viewModel);

	var tweak = new Sprite(0, 30);
	tweakTimer = timer();
	console.log(tweakTimer);
    
	model.getData("All");


});

