/**
 * Dependencies.
 */
var spawn = require('child_process').spawn;

/**
 * Just a slightly more convienent loader than require().
 */
load = function(name) {
	return require(__dirname + '/lib/' + name + '.js');
};

var Truck = function() {

	/* Loads configuration from config.js, using /lib/config.js to provide default behavior. */
	var Config = load('config');
	Config = new Config(__dirname + '/config.js');
	
	/**
	 * Returns a generated shell script as a string.
	 *
	 * env       String    Name of environment.
	 * server    String    Uses to lookup and generate environment variables.
	 * action    String    Action to execute.
	 */
	var generateScript = function(env, server, action) {
		var sources = Config.environments[env].sources;
		var script = load('environment')(server);

		for (var i = 0; i < sources.length; i++) {
			var source = Config.sources[sources[i]];

			var sourceObj = load(source.type);
			sourceObj = new sourceObj(source);

			if (typeof(sourceObj[action]) == 'function') {
				script += sourceObj[action]();
			}
		}

		return script;
	};

	/**
	 * Executes a script remotely by starting ssh and piping the script into it.
	 *
	 * server    String    connection string.
	 * script    String    contents of script to run.
	 * callback  Function  executing after script is completed.
	 */
	var runScript = function(server, script, callback) {
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

	/**
	 * Recursive function that queues scripts and runs them in order, in parallel.
	 *
	 * env       String    Environment.
	 * actions   Array     Array of actions to perform.
	 */
	var runActions = function(env, actions) {
		if (actions.length == 0) {
			return;
		}

		var servers = Config.environments[env].servers;
		var action = actions.shift();

		var processes = 0;

		console.log('= running action', action, '=');

		for (var i = 0; i < servers.length; i++) {
			var server = Config.servers[servers[i]];
			var script = generateScript(env, server, action);

			processes++;
			runScript(server, script, function() {
				processes--;
				if (processes == 0) {
					runActions(env, actions);
				}
			});
		}
	};

	/**
	 * Placeholder - just queues and runs these four actions. This may be good enough,
	 * but in all liklihood we'll want to make this configurable and such.
	 */
	this.deploy = function(env) {
		runActions(env, ['validate', 'export', 'migrate', 'replace']);
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
