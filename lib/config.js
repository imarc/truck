/**
 * Config loads a file as configuration, and uses Config.prototype for defaults.
 */

/**
 * Loads 'filename' using require() and uses it to set properties on the newly constructed object.
 */
var Stack = load('stack');

var Config = function(filename) {
	var globalConfig = new Stack(
		Config.defaults,
		require(filename)
	);

	this.for = function(environment, origin) {
		if (origin === undefined) {
			return new Stack(
				globalConfig,
				globalConfig.environments[environment]
			);
		} else {
			return new Stack(
				globalConfig,
				globalConfig.environments[environment],
				globalConfig.origins[origin]
			);
		}
	};

	this.generateScript = function(environment, origin) {
		var conf = this.for(environment, origin);
		for (var i in conf) {
			//console.log(i, conf[i]);
		}
		return 'FOO=1\n';
	};
};


/**
 * Provides defaults and default behavior.
 */
Config.defaults = new function() {
	var conf = this;

	conf.originDirs  = ['app', 'docroot'];
	conf.contentDirs = ['writable'];

	conf.vhostRoot = '/var/www';

	conf.__defineGetter__('siteRoot', function() {
		return conf.vhostRoot + '/' + conf.site;
	});

	conf.__defineGetter__('pending', function() {
		return conf.siteRoot + '/pending';
	});

	/* Apache */
	conf.apache = {
		command: '/usr/sbin/apache2ctl',
		user: 'apache2',
		get group() { return this.user; }
	};

	/* PostgreSQL */
	conf.postgres = {
		root_user: 'postgres',
		encoding: 'utf-8'
	};

	/* Subversion */
	conf.svn = {
		user: 'server',
		branch: '/trunk',
		repository: 'https://svn.imarc.net/'
	};
	conf.svn.__defineGetter__('url', function() {
		return conf.svn.repository + conf.site + conf.branch;
	});

	/* origins */
	conf.origins = {
		head: {
			svn: {
				user: 'web'
			},
			type: 'svn',
			url: conf.svn.url,
			rev: 'HEAD',
			dirs: conf.originDirs
		},
		staged: {
			type: 'svn',
			url: conf.svn.url,
			rev: '@stage',
			dirs: conf.originDirs
		},
		content: {
			type: 'local',
			path: './prod',
			dirs: conf.contentDirs
		}
	};

	/* Environments */
	conf.environments = {
		dev: {
			hosts: ['localhost'],
			sources: ['head', 'content'],
			get baseDir() { return conf.siteRoot + '/dev'; }
		},
		stage: {
			hosts: ['localhost'],
			sources: ['head', 'content'],
			get baseDir() { return conf.siteRoot + '/stage'; }
		},
		prod: {
			hosts: ['localhost'],
			sources: ['staged'],
			get baseDir() { return conf.siteRoot + '/prod'; }
		}
	};
};

module.exports = Config;
