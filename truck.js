var spawn = require('child_process').spawn;

var Config = function(obj) {
	for (var i in obj) {
		this[i] = obj[i];
	}
};

Config.prototype = {};

var Truck = function(env) {
	var truck = this;

	var config = new Config(require(Truck.path + '/truck.json'));

	if (!(env in config.environments)) {
		throw "The Environment " + env + " is not defined in truck.json.";
	}
	var envConf = config.environments[env];


	var exportSourceToServer = function(source, server) {
		var sourceConf = config.sources[source];
		var serverConf = config.environments[server];

		if ('svn' in sourceConf) {
			console.log("Subversion Export at revision", sourceConf.rev, "for directories", sourceConf.dirs);
		} else if ('base' in sourceConf) {
			console.log("Normal directory copy of", sourceConf.dirs, "from", sourceConf.base);
		}

	};

	var validateServer = function(server) {
	};

	var validateSource = function(source) {
	};


	this.validate = function() {

		for (var i = 0; i < envConf.servers.length; i++) {
			validateServer(envConf.servers[i]);
		}
		for (var j = 0; j < envConf.sources.length; j++) {
			validateSource(envConf.sources[j]);
		}
	};

	this.export = function() {
		for (var i = 0; i < envConf.servers.length; i++) {
			for (var j = 0; j < envConf.sources.length; j++) {
				exportSourceToServer(envConf.sources[j], envConf.servers[i]);
			}
		}
	};

	this.migrate = function() {};
	this.replace = function() {};
};

module.exports = Truck;

var args = process.argv;
if (args.length > 1 && args[1].match('truck.js')) {
	Truck.path = args[1].replace(/\/truck.js$/, '');

	var t = new Truck(args[2]);
	t.validate();
	t.export();
	t.migrate();
	t.replace();
}
