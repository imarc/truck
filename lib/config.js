var Stack = require(__dirname + '/stack.js');

var Config = function(filename) {

	var objFromKeys = function(obj, keys) {
		var subset = {};
		for (var i = 0; i < keys.length; i++) {
			subset[ keys[i] ] = obj[ keys[i] ];
		}

		return subset;
	};

	var localConfig = require(filename);

	this.for = function(environment, origin, host) {
		var s = new Stack(Config.defaults, localConfig);
		if (environment === undefined) {
			return s;
		} else {
			envStack = new Stack(
				Config.defaults,
				localConfig,
				s.environments[environment]
			);
			if (envStack.origins instanceof Array) {
				envStack.origins = objFromKeys(s.origins, envStack.origins);
			}
			if (envStack.hosts instanceof Array) {
				envStack.hosts = objFromKeys(s.hosts, envStack.hosts);
			}
			envStack.environment = environment;



			if (origin === undefined) {
				return envStack;
			} else {
				originStack = new Stack(
					Config.defaults,
					localConfig,
					s.environments[environment],
					s.origins[origin]
				);
				if (envStack.hosts instanceof Array) {
					envStack.hosts = objFromKeys(s.hosts, envStack.hosts);
				}
				originStack.environment = environment;
				originStack.origin = origin;


				if (host === undefined) {
					return originStack;
				} else {
					var hostStack = new Stack(
						Config.defaults,
						localConfig,
						s.environments[environment],
						s.origins[origin],
						s.hosts[host]
					);
					hostStack.environment = environment;
					hostStack.origin = origin;
					hostStack.host = host;

					return hostStack;
				}
			}
		}
	};
};

Config.generateAliases = function(obj, prefix) {
	var aliases = '';

	for (var attr in obj) {
		if (typeof(obj[attr]) == 'object') {
			aliases += Config.generateAliases(obj[attr], prefix + '.' + attr);
		} else {
			aliases += '\nalias ' + prefix + '.' + attr + "='echo \"" + obj[attr] + "\"'";
		}
	}

	return aliases;
};


Config.defaults = {
	vhostRoot: '/var/www',
	get siteRoot() { return this.vhostRoot + '/$(truck.site)'; },
	get envRoot() { return this.siteRoot + '/$(truck.environment)'; },
	
	apache: {
		command: '/usr/sbin/apache2ctl',
		user: 'apache2',
		get group() { return this.user; }
	},

	postgres: {
		rootUser: 'postgres',
		encoding: 'utf-8'
	},

	svn: {
		user: 'server',
		branch: '/trunk',
		rev: 'HEAD',
		host: 'https://svn.imarc.net/',
		get url() { return this.host + '$(truck.site)' + this.branch; },
		directories: [ 'app', 'docroot' ]
	},

	static: {
		directories: [ 'writable' ]
	},


	origins: {
		code: {
			type: 'svn'
		},
		content: {
			type: 'local',
			path: './prod'
		}
	},

	environments: {
		dev: {},
		stage: {},
		prod: {
			origins: [ 'code' ],
			svn: {
				rev: '@stage'
			}
		}
	},

	hosts: {
		localhost: 'web@localhost'
	}
};

module.exports = Config;
