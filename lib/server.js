// Copyright iMarc LLC.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var SSH = require('ssh2'),
	EventEmitter = require('events').EventEmitter,
	util = require('util');

var Server = function(args) {
	this.args = args;
	this.commands = [];

	this.ssh = new SSH();
	this.ssh.on('connect', this._onConnect.bind(this));
	this.ssh.on('ready', this._onReady.bind(this));
};

util.inherits(Server, EventEmitter);

Server.prototype._onConnect = function() {
	console.log('connect');
};

Server.prototype._onReady = function() {
	var command = this.commands.shift();

	if (command === undefined) {
		return this.ssh.end();
	}

	this.ssh.exec(command, this._onExec.bind(this));
};

Server.prototype._onExec = function(err, stream) {
	stream.on('data', this._onData.bind(this));
	stream.on('exit', this._onExit.bind(this));
};

Server.prototype._onData = function(buffer, extended) {
	console.log(buffer.toString());
};

Server.prototype._onExit = function(code, signal) {
	console.log(code);
	this.ssh.end();

	if (command = this.commands.shift()) {
		this.ssh.exec(this.commands, func);
	} else {
		this.ssh.end();
	}
};

Server.prototype.queue = function(command) {
	this.commands.push(command);
};

Server.prototype.exec = function() {
	this.ssh.connect(this.args);

module.exports = Server;
