/**
 * Dependencies.
 */
var spawn = require('child_process').spawn;
var fs = require('fs');
var Config = require(__dirname + '/lib/config.js');


var Truck = function() {
	var shorthand = {
		d: 'debug'
	};

	var config = new Config(__dirname + '/config.js');

	this.parse = function(args) {
		var options = [];
		var params = [];
		for (var i=0; i<args.length; i++) {
			var arg = args[i];
			if (arg.match(/^--/)) {

				options.push(arg.substr(2));
			} else if (arg.match(/^-/)) {
				arg = arg.substr(1);
				for (var j=0; j<arg.length; j++) {
					if (arg[j] in shorthand) {
						options.push(shorthand[arg[j]]);
					} else {
						console.log(arg[j], 'is not a valid option for truck. You lose.');
						process.exit(1);
					}
				}
			} else {
				params.push(arg);
			}
		}

		if (params.length < 2) {
			console.log("Usage: truck ACTION ENVIRONMENT\n");
			process.exit(1);
		}

		var action = params.shift();
		var env = params.shift();

		if (action == 'deploy') {
			this.deploy(env, options, params);
		} else if (action == 'show') {
			this.show(env, options, params);
		} else {
			console.log("Valid actions are: deploy show\n");
			process.exit(1);
		}
	};

	this.show = function(env, options, params) {
		var origin, host;
		if (params.length > 0) {
			origin = params[0];
		}
		if (params.length > 1) {
			host = params[1];
		}

		var conf = config.for(env, origin, host);

		console.log(conf.generateAliases());
	};

	this.deploy = function(env) {
		runActions(env, ['validate', 'export', 'migrate', 'replace', 'cleanup']);
	};

	var runActions = function(env, actions) {
		if (actions.length == 0)  {
			return;
		}

		var action = actions.shift();
		var processes = 0;


		console.log('=', action, '=');
		
		var origins = config.for(env).origins;
		for (var origin in origins) {

			var hosts = config.for(env, origin).hosts;
			for (var host in hosts) {
				var subConfig = config.for(env, origin, host);

				var script = generateScript(subConfig, action);

				processes++;
				runScript(subConfig.sshHost, script, function() {
					if (--processes == 0) {
						runActions(env, actions);
					}
				});
			}

		}
	};

	var generateScript = function(config, action) {
		var script = '';
		var baseFilename = __dirname + '/scripts/' + config.originType + '.' + action;

		var common = '';
		if (fs.existsSync(__dirname + '/scripts/common.sh')) {
			common = fs.readFileSync(__dirname + '/scripts/common.sh');
		}
		if (fs.existsSync(baseFilename + '.pre.sh')) {
			script += fs.readFileSync(baseFilename + '.pre.sh') + "\n";
		}
		if (fs.existsSync(baseFilename + '.sh')) {
			script += fs.readFileSync(baseFilename + '.sh') + "\n";
		}
		if (fs.existsSync(baseFilename + '.post.sh')) {
			script += fs.readFileSync(baseFilename + '.post.sh') + "\n";
		}

		if (script.length > 0) {
			return common + '\n' + config.generateAliases() + '\n' + script;
		} else {
			return '';
		}
	};

	var runScript = function(server, script, callback) {
		//console.log('runScript', server, script);
		var proc = spawn('ssh', [ '-T', server, 'bash' ]);
		proc.stdin.end(script);
		proc.stdout.on('data', function(data) { console.log((server + ': ' + data).trim()); });
		proc.stderr.on('data', function(data) { console.log((server + ': ' + data).trim()); });

		proc.on('exit', function(code, signal) {
			if (code == 0) {
				if (typeof(callback) == 'function') {
					callback();
				}
			} else {
				process.exit(code);
			}
		});
	};
};

/**
 * Arguments handling, to handle being called directly (./truck.js ...) or with node
 * (node ./truck.js ...).
 */
var args = process.argv;
if (args.length > 1 && args[1].match(__filename)) {
	args = args.slice(2);
} else if (args.length && args[0].match(__filename)) {
	args = args.slice(1);
} else {
	//show help
	console.log("You need help.");
}

/**
 * Placeholder - we'll want to make this more flexible, but for now its hard coded to expect the ENV
 * as the one and only argument, and to always deploy.
 */
var t = new Truck();
t.parse(args);
