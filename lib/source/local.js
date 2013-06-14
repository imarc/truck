/**
 * These method names should correspond to actions, and should return chunks of shell script.
 */
var LocalSource = function(conf) {
	this.validate = function() {
		var script = '';
		script += 'echo "validate we can copy a directory"\n';
		script += 'sleep 5\n';
		return script;
	}
	this.export = function() {
		var script = '';
		script += 'echo "copy writable"\n';
		return script;
	};
};

module.exports = LocalSource;
