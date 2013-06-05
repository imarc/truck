var SVNSource = function(conf) {
	this.validate = function() {
		console.log("Validating SVNSource", conf);
	};

	this.exportToServer = function(server) {
		console.log("Exporting SVNSource to Server", conf, server);
	};
};

module.exports = SVNSource;
