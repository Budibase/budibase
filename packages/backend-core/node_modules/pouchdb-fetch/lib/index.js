'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var nodeFetch = require('node-fetch');
var nodeFetch__default = _interopDefault(nodeFetch);
var fetchCookie = _interopDefault(require('fetch-cookie'));
var abortController = _interopDefault(require('abort-controller'));

var fetch = fetchCookie(nodeFetch__default);

exports.Headers = nodeFetch.Headers;
exports.AbortController = abortController;
exports.fetch = fetch;
