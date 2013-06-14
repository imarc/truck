/**
 * These method names should correspond to actions, and should return chunks of shell script.
 */
var SVNSource = function(source) {
	this.validate = function() {
		var script = '';
		script += 'echo "Validate subversion can work"\n';
		return script;
	};

	this.export = function() {
		var script = '';
		script += 'echo "Export from subversion"\n';
		return script;
	};
};

module.exports = SVNSource;
