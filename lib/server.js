var Server = function(conf) {
	this.validate = function() {
		console.log("Validating Server", conf);
	};
};

module.exports = Server;
