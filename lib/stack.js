/**
 * A stack is a combination of multiple objects by layering them, so that when calling a method or
 * looking up a property on the stack, it descends through the stack until it finds an object that
 * has that property.
 *
 * Unfortunately, once the stack is created, any new properties or methods aren't automatically
 * defined on the stack.
 */

var Stack = function() {
	var objs = arguments;

	for (var i = 0; i < arguments.length; i++) {
		for (var attr in arguments[i]) {
			this.__defineGetter__(attr, (function(obj, attr) {
				return function() {
					return obj[attr];
				};
			})(arguments[i], attr));
			this.__defineSetter__(attr, (function(obj, attr) {
				return function(val) {
					delete obj[attr];
					obj[attr] = val;
				};
			})(this, attr));
		}
	}
};

module.exports = Stack;
