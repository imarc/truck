/**
 * Here's where we'll right the code to generate the section of the shell script that sets all
 * environment variables (if necessary.) I'm only setting TARGET right now.
 */
var environment = function(env, server) {
	var script = 'cd ' + __dirname + "\n";
	var script = 'shopt -s expand_aliases\n';
	var set = function(name, val) {
		script += "alias " + name.toLowerCase() + '="echo \'' + val + '\'"\n';
	};

	set('truck.svn.url', 'https://svn.imarc.net/kevin.sandbox.imarc.net');

	return script;
};

module.exports = environment;
