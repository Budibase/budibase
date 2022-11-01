"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const lodash_1 = require("./lodash");
exports.defaults = lodash_1.defaults;
exports.noop = lodash_1.noop;
exports.flatten = lodash_1.flatten;
const debug_1 = require("./debug");
exports.Debug = debug_1.default;
const TLSProfiles_1 = require("../constants/TLSProfiles");
/**
 * Test if two buffers are equal
 *
 * @export
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {boolean} Whether the two buffers are equal
 */
function bufferEqual(a, b) {
    if (typeof a.equals === "function") {
        return a.equals(b);
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.bufferEqual = bufferEqual;
/**
 * Convert a buffer to string, supports buffer array
 *
 * @param {*} value - The input value
 * @param {string} encoding - string encoding
 * @return {*} The result
 * @example
 * ```js
 * var input = [Buffer.from('foo'), [Buffer.from('bar')]]
 * var res = convertBufferToString(input, 'utf8')
 * expect(res).to.eql(['foo', ['bar']])
 * ```
 * @private
 */
function convertBufferToString(value, encoding) {
    if (value instanceof Buffer) {
        return value.toString(encoding);
    }
    if (Array.isArray(value)) {
        const length = value.length;
        const res = Array(length);
        for (let i = 0; i < length; ++i) {
            res[i] =
                value[i] instanceof Buffer && encoding === "utf8"
                    ? value[i].toString()
                    : convertBufferToString(value[i], encoding);
        }
        return res;
    }
    return value;
}
exports.convertBufferToString = convertBufferToString;
/**
 * Convert a list of results to node-style
 *
 * @param {Array} arr - The input value
 * @return {Array} The output value
 * @example
 * ```js
 * var input = ['a', 'b', new Error('c'), 'd']
 * var output = exports.wrapMultiResult(input)
 * expect(output).to.eql([[null, 'a'], [null, 'b'], [new Error('c')], [null, 'd'])
 * ```
 * @private
 */
function wrapMultiResult(arr) {
    // When using WATCH/EXEC transactions, the EXEC will return
    // a null instead of an array
    if (!arr) {
        return null;
    }
    const result = [];
    const length = arr.length;
    for (let i = 0; i < length; ++i) {
        const item = arr[i];
        if (item instanceof Error) {
            result.push([item]);
        }
        else {
            result.push([null, item]);
        }
    }
    return result;
}
exports.wrapMultiResult = wrapMultiResult;
/**
 * Detect if the argument is a int
 *
 * @param {string} value
 * @return {boolean} Whether the value is a int
 * @example
 * ```js
 * > isInt('123')
 * true
 * > isInt('123.3')
 * false
 * > isInt('1x')
 * false
 * > isInt(123)
 * true
 * > isInt(true)
 * false
 * ```
 * @private
 */
function isInt(value) {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}
exports.isInt = isInt;
/**
 * Pack an array to an Object
 *
 * @param {array} array
 * @return {object}
 * @example
 * ```js
 * > packObject(['a', 'b', 'c', 'd'])
 * { a: 'b', c: 'd' }
 * ```
 */
function packObject(array) {
    const result = {};
    const length = array.length;
    for (let i = 1; i < length; i += 2) {
        result[array[i - 1]] = array[i];
    }
    return result;
}
exports.packObject = packObject;
/**
 * Return a callback with timeout
 *
 * @param {function} callback
 * @param {number} timeout
 * @return {function}
 */
function timeout(callback, timeout) {
    let timer;
    const run = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            callback.apply(this, arguments);
        }
    };
    timer = setTimeout(run, timeout, new Error("timeout"));
    return run;
}
exports.timeout = timeout;
/**
 * Convert an object to an array
 *
 * @param {object} obj
 * @return {array}
 * @example
 * ```js
 * > convertObjectToArray({ a: '1' })
 * ['a', '1']
 * ```
 */
function convertObjectToArray(obj) {
    const result = [];
    const keys = Object.keys(obj); // Object.entries requires node 7+
    for (let i = 0, l = keys.length; i < l; i++) {
        result.push(keys[i], obj[keys[i]]);
    }
    return result;
}
exports.convertObjectToArray = convertObjectToArray;
/**
 * Convert a map to an array
 *
 * @param {Map} map
 * @return {array}
 * @example
 * ```js
 * > convertMapToArray(new Map([[1, '2']]))
 * [1, '2']
 * ```
 */
function convertMapToArray(map) {
    const result = [];
    let pos = 0;
    map.forEach(function (value, key) {
        result[pos] = key;
        result[pos + 1] = value;
        pos += 2;
    });
    return result;
}
exports.convertMapToArray = convertMapToArray;
/**
 * Convert a non-string arg to a string
 *
 * @param {*} arg
 * @return {string}
 */
function toArg(arg) {
    if (arg === null || typeof arg === "undefined") {
        return "";
    }
    return String(arg);
}
exports.toArg = toArg;
/**
 * Optimize error stack
 *
 * @param {Error} error - actually error
 * @param {string} friendlyStack - the stack that more meaningful
 * @param {string} filterPath - only show stacks with the specified path
 */
function optimizeErrorStack(error, friendlyStack, filterPath) {
    const stacks = friendlyStack.split("\n");
    let lines = "";
    let i;
    for (i = 1; i < stacks.length; ++i) {
        if (stacks[i].indexOf(filterPath) === -1) {
            break;
        }
    }
    for (let j = i; j < stacks.length; ++j) {
        lines += "\n" + stacks[j];
    }
    const pos = error.stack.indexOf("\n");
    error.stack = error.stack.slice(0, pos) + lines;
    return error;
}
exports.optimizeErrorStack = optimizeErrorStack;
/**
 * Parse the redis protocol url
 *
 * @param {string} url - the redis protocol url
 * @return {Object}
 */
function parseURL(url) {
    if (isInt(url)) {
        return { port: url };
    }
    let parsed = url_1.parse(url, true, true);
    if (!parsed.slashes && url[0] !== "/") {
        url = "//" + url;
        parsed = url_1.parse(url, true, true);
    }
    const options = parsed.query || {};
    const allowUsernameInURI = options.allowUsernameInURI && options.allowUsernameInURI !== "false";
    delete options.allowUsernameInURI;
    const result = {};
    if (parsed.auth) {
        const index = parsed.auth.indexOf(":");
        if (allowUsernameInURI) {
            result.username =
                index === -1 ? parsed.auth : parsed.auth.slice(0, index);
        }
        result.password = index === -1 ? "" : parsed.auth.slice(index + 1);
    }
    if (parsed.pathname) {
        if (parsed.protocol === "redis:" || parsed.protocol === "rediss:") {
            if (parsed.pathname.length > 1) {
                result.db = parsed.pathname.slice(1);
            }
        }
        else {
            result.path = parsed.pathname;
        }
    }
    if (parsed.host) {
        result.host = parsed.hostname;
    }
    if (parsed.port) {
        result.port = parsed.port;
    }
    lodash_1.defaults(result, options);
    return result;
}
exports.parseURL = parseURL;
/**
 * Resolve TLS profile shortcut in connection options
 *
 * @param {Object} options - the redis connection options
 * @return {Object}
 */
function resolveTLSProfile(options) {
    let tls = options === null || options === void 0 ? void 0 : options.tls;
    if (typeof tls === "string")
        tls = { profile: tls };
    const profile = TLSProfiles_1.default[tls === null || tls === void 0 ? void 0 : tls.profile];
    if (profile) {
        tls = Object.assign({}, profile, tls);
        delete tls.profile;
        options = Object.assign({}, options, { tls });
    }
    return options;
}
exports.resolveTLSProfile = resolveTLSProfile;
/**
 * Get a random element from `array`
 *
 * @export
 * @template T
 * @param {T[]} array the array
 * @param {number} [from=0] start index
 * @returns {T}
 */
function sample(array, from = 0) {
    const length = array.length;
    if (from >= length) {
        return;
    }
    return array[from + Math.floor(Math.random() * (length - from))];
}
exports.sample = sample;
/**
 * Shuffle the array using the Fisher-Yates Shuffle.
 * This method will mutate the original array.
 *
 * @export
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        [array[counter], array[index]] = [array[index], array[counter]];
    }
    return array;
}
exports.shuffle = shuffle;
/**
 * Error message for connection being disconnected
 */
exports.CONNECTION_CLOSED_ERROR_MSG = "Connection is closed.";
function zipMap(keys, values) {
    const map = new Map();
    keys.forEach((key, index) => {
        map.set(key, values[index]);
    });
    return map;
}
exports.zipMap = zipMap;
