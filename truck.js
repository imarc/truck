/**
 * This is truck.
 *
 * @version 0.9
 */

var spawn = require('child_process').spawn;
var fs = require('fs');
var GetOpt = require('node-getopt');
var Config = require(__dirname + '/lib/config.js');

opt = require('node-getopt').create([
	['d', 'debug', 'Turn on debugging.'],
	['h', 'help',  'Show this help']
]).bindHelp().parseSystem();

var Truck = function() {
	// config is the loaded configuration based on config.js.
	var config = new Config(__dirname + '/config.js');


	this.drive = function() {
		var getopt = GetOpt.create([
			['d', 'debug', 'Turn on debugging.'],
			['h', 'help',  'Show this help']
		]).bindHelp().parseSystem();

		GetOpt.on('help', function() {
			GetOpt.showHelp();
			process.exit(1);
		});

		if (getopt.argv.length != 2) {
			GetOpt.showHelp();
			process.exit(1);
		}

		var action = params.shift();
		var env = params.shift();


		if (!(action in ['show', 'validate', 'export', 'migrate', 'replace', 'cleanup', 'deploy'])) {
			console.log('action must be one of the following: deploy show validate export migrate replace cleanup');
			process.exit(1);
		}

		this[action](env, getopt.argv, getopt.options);
	};


	this.show = function(env, argv, options) {
	};

	this.deploy = function(env, argv, options) {
	};


	var perform = function(actions, env, argv, options) {

		var action = actions.shift();

		var origins = config.for(env).origins;
		for (var origin in origins) {
			var hosts = config.for(env, origin).hosts;
			for (var host in hosts) {
				var targetConfig = config.for(env, origin, host);

				if (!targetConfig.sourceHost) {
					targetConfig.sourceHost = targetConfig.hosts[0];
				}

				var sourceConfig = config.for(
					targetConfig.source,
					origin,
					targetConfig.sourceHost
				);

				var script = generateScript(sourceConfig, targetConfig, action);

				console.log("SCRIPT", script);

				/*
				processes++;
				runScript(targetConfig.host, script, function() {
					if (--processes == 0) {
						perform(actions, env, argv, options);
					}
				});
				*/
			}
		}
	};

	var generateScript = function(sourceConfig, targetConfig, action) {
		var script = '';
		var baseFilename = [__dirname, 'scripts', config.originType].join('/') + '.' + action + '.sh';

		if (fs.existsSync(baseFilename)) {
			script += fs.readFileSync(baseFilename) + "\n";
		}

		if (script.length > 0) {
			return [
				fs.readFileSync(__dirname + '/scripts/common.sh'),
				sourceConfig.generateAliases('source'),
				targetConfig.generateAliases(),
				script
			].join("\n");
		} else {
			return '';
		}
	};
};

(new Truck()).drive();
