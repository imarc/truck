/**
 * Config loads a file as configuration, and uses Config.prototype for defaults.
 */

/**
 * Loads 'filename' using require() and uses it to set properties on the newly constructed object.
 */
var Config = function(filename) {
	var obj = require(filename);
	for (var i in obj) {
		if (typeof(this[i]) == 'object' && typeof(obj[i]) == 'object') {
			for (var j in obj[i]) {
				this[i][j] = obj[i][j];
			}
		} else {
			this[i] = obj[i];
		}
	}
};

/**
 * Provides defaults and default behavior.
 */
Config.prototype = new function() {
	var conf = this;

	conf.sourceDirs = ['app', 'docroot'];
	conf.contentDirs = ['writable'];

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

	/* Sources */
	conf.sources = {
		head: {
			type: 'source/svn',
			url: conf.svn.url,
			rev: 'HEAD',
			dirs: conf.sourceDirs
		},
		staged: {
			type: 'source/svn',
			url: conf.svn.url,
			rev: '@stage',
			dirs: conf.sourceDirs
		},
		content: {
			type: 'source/local',
			path: './prod',
			dirs: conf.contentDirs
		}
	};

	/* Environments */
	conf.environments = {
		dev: {
			servers: ['localhost'],
			sources: ['head', 'content']
		},
		stage: {
			servers: ['localhost'],
			sources: ['head', 'content']
		},
		prod: {
			servers: ['localhost'],
			sources: ['staged']
		}
	};
};

module.exports = Config;
