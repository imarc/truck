var Config = function(filename) {
	var localConfig = require(filename);
	for (var i in localConfig) {
		delete this[i];
		this[i] = localConfig[i];
	}
};

Config.prototype = {
	vhostRoot: '/var/www',

	get siteRoot() { return this.vhostRoot + '/' + this.site; },
	get envRoot() { return this.siteRoot + '/' + this.environment; },
	get tempRoot() { return this.envRoot + '-pending'; },
	get backupRoot() { return this.envRoot + '-old'; },

	apacheCommand: '/etc/init.d/apache2',
	apacheUser: 'apache2',
	get apacheGroup() { return this.apacheUser; },

	postgresRootUser: 'postgres',
	postgresEncoding: 'utf-8',
	get postgresDB() {
		if (this.environment == 'prod') {
			return this.site.replace(/[^a-zA-Z0-9]/g, '_');
		} else {
			return this.environment + '_' + this.site.replace(/[^a-zA-Z0-9]/g, '_');
		}
	},
	postgresSourceDB: 'TODO',
	postgresUser: 'postgres',

	svnUser: 'server',
	svnBranch: '/trunk',
	svnRev: 'HEAD',
	svnHost: 'https://svn.imarc.net/',
	get svnUrl() { return this.svnHost + this.site + this.svnBranch; },
	svnDirectories: 'app docroot',
	get svnExportDir() { return this.tempRoot + '-svn'; },

	localDirectories: 'writable',
	get localPath() { return this.siteRoot + '/prod'; },

	environments: {
		dev: {},
		stage: {},
		prod: {
			origins: [ 'code' ],
			svnRev: '@stage'
		}
	},

	origins: {
		code: {
			originType: 'svn'
		},
		content: {
			originType: 'local',
		},
		database: {
			originType: 'postgres',
		}
	},

	hosts: {
		localhost: {
			sshHost: 'web@localhost'
		}
	},




	for: function(env, origin, host) {

		var obj = Object.create(this);

		obj.environment = env;
		obj.origin = origin;
		obj.host = host;

		for (var attr in obj.environments[env]) {
			var val = obj.environments[env][attr];

			if (attr == 'origins' && val instanceof Array) {
				var newval = {};
				for (var i = 0; i < val.length; i++) {
					newval[ val[i] ] = obj.origins[ val[i] ];
				}
				obj[attr] = newval;

			} else if (attr == 'hosts' && val instanceof Array) {
				var newval = {};
				for (var i = 0; i < val.length; i++) {
					newval[ val[i] ] = obj.hosts[ val[i] ];
				}
				obj[attr] = newval;

			} else {
				obj[attr] = val;
			}
		}

		if (origin !== undefined) {
			for (var attr in obj.origins[origin]) {
				var val = obj.origins[origin][attr];

				if (attr == 'hosts' && val instanceof Array) {
					var newval = {};
					for (var i = 0; i < val.length; i++) {
						newval[ val[i] ] = obj.hosts[ val[i] ];
					}
					obj[attr] = newval;

				} else {
					obj[attr] = val;
				}
			}
		}

		if (host !== undefined) {
			for (var attr in obj.hosts[host]) {
				obj[attr] = obj.hosts[host][attr];
			}
		}

		return obj;
	},

	generateAliases: function() {
		var aliases = '';

		for (var attr in this) {
			var val = this[attr];
			if (typeof(val) == 'function' || typeof(val) == 'object' || val === undefined) continue;

			aliases += '\nalias truck.' + attr + "='echo \"" + val + "\"'";
		}

		return aliases;
	}
};

module.exports = Config;
