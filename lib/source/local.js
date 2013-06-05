var LocalSource = function(conf) {
	this.validate = function() {
		console.log("Validating LocalSource", conf);
	};

	this.exportToServer = function(server) {
		console.log("Exporting LocalSource to Server", conf, server);
	};
};

module.exports = LocalSource;
