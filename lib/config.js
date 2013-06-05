var Config = function(filename, defaults) {
	var obj = require(filename);
	var F = function(obj) {
		for (var i in obj) {
			this[i] = obj[i];
		}
	};
	F.prototype = defaults;
	return new F(obj);
};

module.exports = Config;
