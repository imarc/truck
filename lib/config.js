var Stack = require(__dirname + '/stack.js');

var Config = function(filename) {

	var localConfig = require(filename);

	this.for = function(environment, origin) {
		var s = new Stack(Config.defaults, localConfig);

		if (origin === undefined) {
			s.active = new Stack(
				s,
				s.environments[environment]
			);
			s.activeEnvironment = environment;
		} else {
			s.active = new Stack(
				s,
				s.environments[environment],
				s.origins[origin]
			);
			s.activeEnvironment = environment;
			s.activeOrigin = origin;
		}

		if (s.active.hosts instanceof Array) {
			var newHosts = {};
			for (var i = 0; i < s.active.hosts.length; i++) {
				var key = s.active.hosts[i];
				newHosts[key] = s.hosts[key];
			}
			s.active.hosts = newHosts;
		}

		if (s.active.origins instanceof Array) {
			var newOrigins = {};
			for (var i = 0; i < s.active.origins.length; i++) {
				var key = s.active.origins[i];
				newOrigins[key] = s.origins[key];
			}
			s.active.origins = newOrigins;
		}

		return s;
	};

	function generateAliases(obj, prefix) {
		var aliases = '';

		if (prefix === undefined) {
			prefix = 'truck';
		}

		for (var attr in obj) {
			if (typeof(obj[attr]) == 'object') {
				aliases += generateAliases(obj[attr], prefix + '.' + attr);
			} else {
				aliases += '\nalias ' + prefix + '.' + attr + "='echo \"" + obj[attr] + "\"'";
			}
		}

		return aliases;
	};

	this.generateEnvironment = function(environment, origin) {
		var conf = this.for(environment, origin);

		return 'shopt -s expand_aliases\n' + generateAliases(conf);
	};
};

Config.defaults = {
	vhostRoot: '/var/www',
	get siteRoot() { return this.vhostRoot + '/$(truck.site)'; },
	get envRoot() { return this.siteRoot + '/$(truck.activeEnvironment)'; },
	
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
