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

		obj.environment    = env;
		obj.origin = origin;
		obj.host   = host;

		if (environment in obj.environments) {
			for (var i in obj.environments[environment]) {
				this[i] = obj.environments[environment][i];
			}
		}

		if (origin in obj.origins) {
			for (var i in obj.origins[origin]) {
				this[i] = obj.origins[origin][i];
			}
		}

		if (host in obj.hosts) {
			for (var i in obj.hosts[host]) {
				this[i] = obj.hosts[host][i];
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
