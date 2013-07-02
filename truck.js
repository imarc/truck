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

		var action = actions.shift();
		var processes = 0;


		console.log('=', action, '=');
		
		var origins = config.for(env).origins;
		for (var origin in origins) {

			var hosts = config.for(env, origin).hosts;
			for (var host in hosts) {
				var hostString = hosts[host];
				var script = generateScript(env, origin, host, action);

				processes++;
				runScript(hosts[host], script, function() {
					if (--processes == 0) {
						runActions(env, actions);
					}
				});
			}

		}
	};

	var generateScript = function(env, origin, host, action) {
		var conf = config.for(env, origin, host);
		var script = 'shopt -s expand_aliases\n';
		var baseFilename = __dirname + '/scripts/' + conf.type + '.' + action;

		var aliases = Config.generateAliases(conf, 'truck');

		//console.log("**", baseFilename, "**");

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
			return aliases + "\n" + script;
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
t.deploy(args[0]);
