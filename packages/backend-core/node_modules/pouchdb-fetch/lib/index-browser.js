'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// AbortController was introduced quite a while after fetch and
// isnt required for PouchDB to function so polyfill if needed
var a = (typeof AbortController !== 'undefined')
    ? AbortController
    : function () { return {abort: function () {}}; };

var f = fetch;
var h = Headers;

exports.fetch = f;
exports.Headers = h;
exports.AbortController = a;
