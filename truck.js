/**
 * Dependencies.
 */
var spawn = require('child_process').spawn;
var fs = require('fs');
var Config = require(__dirname + '/lib/config.js');


var Truck = function() {
	var config = new Config(__dirname + '/config.js');

	this.deploy = function(env) {
		runActions(env, ['validate', 'export', 'migrate', 'replace']);
	};

	var runActions = function(env, actions) {
		if (actions.length == 0)  {
			return;
		}

		var hosts = config.for(env).active.hosts;
		var action = actions.shift();

		var processes = 0;

		console.log('=', action, '=');

		for (var key in hosts) {
			var host = hosts[key];
			var script = generateScript(env, action);

			processes++;
			runScript(hosts[key], script, function() {
				processes--;

				if (processes == 0) {
					runActions(env, actions);
				}
			});
		}
	};

	var generateScript = function(env, action) {
		var origins = config.for(env).active.origins;

		var script = '';

		for (var originKey in origins) {
			var origin = origins[originKey];

			var originConfig = config.for(env, originKey);

			var baseFilename = __dirname + '/scripts/' + originConfig.active.type + '.' + action;

			var aliases = config.generateEnvironment(env, originKey);

			console.log('baseFilename', baseFilename);

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
				script = aliases + "\n" + script;
			}
		}

		return script;
	};

	var runScript = function(server, script, callback) {
		console.log('runScript', server, script);
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
t.deploy(args[0]);
