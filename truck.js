var spawn = require('child_process').spawn;

load = function(objectname, base) {
	if (base === undefined) {
		base = './lib';
	}

	var filename = base + '/' + objectname + '.js';
	return require(filename);
};

var Config = load('config');
var Server = load('server');

var defaults = {
	forEnv: function(name) {
		if (name in this.environments) {
			return this.environments[name];
		} else {
			throw "No configuration for environment " + name + ".";
		}
	},

	forServer: function(name) {
		if (name in this.servers) {
			return this.servers[name];
		} else {
			throw "No configuration for server " + name + ".";
		}
	},

	createServer: function(name) {
		return new Server(this.forServer(name));
	},

	forSource: function(name) {
		if (name in this.sources) {
			return this.sources[name];
		} else {
			throw "No configuration for source " + name + ".";
		}
	},

	createSource: function(name) {
		var conf = this.forSource(name);
		if ('type' in conf) {
			var type = load(conf.type);
			return new type(conf);
		} else {
			throw "Source " + name + " is missing a type.";
		}
	}
};


var Truck = function(env) {
	var truck = this;

	var config = new Config(Truck.path + '/examples/truck.json', defaults);

	var envConf = config.forEnv(env);


	this.validate = function() {

		for (var i = 0; i < envConf.servers.length; i++) {
			var servername = envConf.servers[i];
			config.createServer(servername).validate();
		}
		for (var j = 0; j < envConf.sources.length; j++) {
			var sourcename = envConf.sources[j];
			config.createSource(sourcename).validate();
		}
	};

	this.export = function() {
		for (var i = 0; i < envConf.servers.length; i++) {
			var servername = envConf.servers[i];
			var server = config.createServer(servername);
			
			for (var j = 0; j < envConf.sources.length; j++) {
				var sourcename = envConf.sources[j];

				config.createSource(sourcename).exportToServer(server);
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
