window.Connection = function(scope, id){
	var self = this;
	var API_KEY = "bqpiqnf97t7f1or";
	var DEFAULT_CONFIG = {
		key: API_KEY,
		iceServers: [
			{ url: 'stun:stun.l.google.com:19302' }
		]
	};
	var peer = null;
	// Connection:
	if (id && id.trim().length){
		peer = new Peer(id, DEFAULT_CONFIG);
	} else {
		peer = new Peer(DEFAULT_CONFIG);
	}
	self.connection = false;
	self.CREATOR = false;

	var generateLog = function(fn){console.trace("TRACING MESSAGE"); return fn;}

	var handleNetworkConnection = function(id){
		// console.warn("SKYNET: CONNECTION ESTABLISHED");
		// console.info("LOCAL CHANNEL OPENED WITH ID:", id);
		self.id = id;
		scope.atOpen(id);
		scope.update();
	};

	var handleIncomingData = function(CREATOR){
		if (CREATOR){
			return function(data){
				switch (typeof data){
					case 'string':
						// console.warn("> JOINER PEER:", data);
						if (data.search("NUCLEAR")+1){
							self.sendData("WHAT?")
						} else if(data.search("START")+1){
							scope.updateReady();
						}
						break;
					case 'object':
						// console.warn("JOINER PEER HAS SENT AN OBJECT");
						if ('character' in data){
							// console.info("JOINER PEER HAS CHANGED CHARACTER");
							scope.updateCharacter(data.character);
							break;
						}
						if ('keys' in data){
							scope.updateKeys(data.keys)
							break;
						}
						break;
				}
				scope.update();
			};
		} else {
			return function(data){
				switch (typeof data){
					case 'string':
						// console.warn("> CREATOR PEER:", data);
						if (data == "WHAT?"){
							self.sendData("JUST KIDDING!")
						} else if(data.search("START")+1){
							scope.updateReady();
						}
						break;
					case 'object':
						// console.warn("ADMIN HAS SENT AN OBJECT");
						if ('character' in data){
							// console.info("ADMIN HAS CHANGED CHARACTER");
							scope.updateCharacter(data.character);
							break;
						}
						if ('keys' in data){
							scope.updateKeys(data.keys)
							break;
						}
						break;
				}
				scope.update();
			}
		}
	}

	self.sendData = function(data){
		// console.info(">",self.CREATOR?"ADMIN:":"LOCAL:", data);
		self.connection.send(data);
	}

	self.sendKeys = function(keys){
		self.sendData({ keys: keys });
	}

	self.sendCharacter = function(character){
		self.sendData({ character: character });
	}

	self.sendReady = function(){
		self.sendData("START");
	}
	var handleIncomingConnection = function(conn) {
		self.CREATOR = true;
		// console.info("PEER", conn.peer, "HAS CONNECTED ON CHANNEL", conn.id);
		conn.on('data', handleIncomingData(self.CREATOR));
		scope.atConnection();
		scope.update();
		if (!self.connection) self.connection = conn;
	};


	var initConnection = function(to_id, success){
		// console.info("ESTABILISHING CONNECTION WITH", to_id)
		self.connection = peer.connect(to_id);

		self.connection.on('open', function(){
			// console.info('CONNECTION ESTABLISHED WITH CHANNEL ID:', self.connection.id);
			self.sendData('CONNECTION INITIATED, INMINENT NUCLEAR LAUNCH.');

			// console.debug(self.connection);
			self.connection.on('data', handleIncomingData(self.CREATOR));
			scope.atConnection();
			scope.update();
			if (success) success(self.connection);
		});
	};

	self.id = null;
	self.connect = initConnection;

	// Listener for channel open
	peer.on('open', handleNetworkConnection);

	// Listener for connection
	peer.on('connection', handleIncomingConnection);
};
