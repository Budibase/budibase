'use strict';

/*
 * http://nodejs.org/api/events.html
 */

function EventEmitter() {}

EventEmitter.prototype.addListener = function () {};
EventEmitter.prototype.on = function () {};
EventEmitter.prototype.once = function () {};
EventEmitter.prototype.removeListener = function () {};
EventEmitter.prototype.removeAllListeners = function () {};
// EventEmitter.prototype.removeAllListeners = function([event])
EventEmitter.prototype.setMaxListeners = function () {};
EventEmitter.prototype.listeners = function () {};
EventEmitter.prototype.emit = function () {};
EventEmitter.prototype.prependListener = function () {};
// EventEmitter.prototype.emit = function(event, [arg1], [arg2], [...]){}

module.exports = EventEmitter;
