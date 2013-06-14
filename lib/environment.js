/**
 * Here's where we'll right the code to generate the section of the shell script that sets all
 * environment variables (if necessary.) I'm only setting TARGET right now.
 */
var environment = function(env, server) {
	var script = '';
	var set = function(name, val) {
		script += name.toUpperCase() + '="' + val + '"\n';
	};

	set('target', env);

	return script;
};

module.exports = environment;
