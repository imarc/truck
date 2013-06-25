var Stack = function() {
	for (var i = 0; i < arguments.length; i++) {
		for (var prop in arguments[i]) {
			if (this[prop] instanceof Array && arguments[i][prop] instanceof Array) {
				this[prop] = arguments[i][prop];
			} else if (typeof(this[prop]) == 'object' && typeof(arguments[i][prop]) == 'object') {
				this[prop] = new Stack(this[prop], arguments[i][prop]);
			} else {
				this[prop] = arguments[i][prop];
			}
		}
	}
};

module.exports = Stack;
