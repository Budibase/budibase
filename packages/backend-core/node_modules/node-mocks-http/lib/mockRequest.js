'use strict';

/**
 * File: mockRequest
 *
 * This file implements node.js's implementation of a 'request' object.
 * This is actually closer to what Express offers the user, in that the
 * body is really a parsed object of values.
 *
 * @author Howard Abrams <howard.abrams@gmail.com>
 */

/**
 * Function: createRequest
 *
 *    Creates a new mock 'request' instance. All values are reset to the
 *    defaults.
 *
 * Parameters:
 *
 *   options - An object of named parameters.
 *
 * Options:
 *
 *   method      - The method value, see <mockRequest._setMethod>
 *   url         - The url value, see <mockRequest._setURL>
 *   originalUrl - The originalUrl value, see <mockRequest._setOriginalUrl>
 *   baseUrl     - The baseUrl value, see <mockRequest._setBaseUrl>
 *   params      - The parameters, see <mockRequest._setParam>
 *   body        - The body values, , see <mockRequest._setBody>
 */

var url = require('url');
var typeis = require('type-is');
var accepts = require('accepts');
var parseRange = require('range-parser');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');

var standardRequestOptions = [
    'method', 'url', 'originalUrl', 'baseUrl', 'path', 'params', 'session', 'cookies', 'headers', 'body', 'query', 'files'
];

function createRequest(options) {

    if (!options) {
        options = {};
    }

    if (options.eventEmitter) {
        EventEmitter = options.eventEmitter;
    }

    // create mockRequest
    var mockRequest = Object.create(EventEmitter.prototype);
    EventEmitter.call(mockRequest);

    mockRequest.method = options.method ? options.method : 'GET';
    mockRequest.url = options.url || options.path || '';
    mockRequest.originalUrl = options.originalUrl || mockRequest.url;
    mockRequest.baseUrl = options.baseUrl || mockRequest.url;
    mockRequest.path = options.path ||
        ((options.url ? url.parse(options.url).pathname : ''));
    mockRequest.params = options.params ? options.params : {};
    if (options.session) {
        mockRequest.session = options.session;
    }
    mockRequest.cookies = options.cookies ? options.cookies : {};
    if (options.signedCookies) {
        mockRequest.signedCookies = options.signedCookies;
    }
    mockRequest.headers = options.headers ? utils.convertKeysToLowerCase(options.headers) : {};
    mockRequest.body = options.body ? options.body : {};
    mockRequest.query = options.query ? options.query : {};
    mockRequest.files = options.files ? options.files : {};
    mockRequest.socket = options.socket ? options.socket : {};

    mockRequest.ip = options.ip || '127.0.0.1';
    mockRequest.ips = [mockRequest.ip];

    //parse query string from url to object
    if (Object.keys(mockRequest.query).length === 0) {
        mockRequest.query = require('querystring').parse(mockRequest.url.split('?')[1]);

        if (!mockRequest.query.hasOwnProperty) {
            Object.defineProperty(
                mockRequest.query,
                'hasOwnProperty',
                {
                    enumerable: false,
                    value: Object.hasOwnProperty.bind(mockRequest.query)
                }
            );
        }
    }

    // attach any other provided objects into the request for more advanced testing
    for (var n in options) {
        if (standardRequestOptions.indexOf(n) === -1) {
            mockRequest[n] = options[n];
        }
    }

    /**
     * Return request header.
     *
     * The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *
     *     mockRequest.get('Content-Type');
     *     // => "text/plain"
     *
     *     mockRequest.get('content-type');
     *     // => "text/plain"
     *
     *     mockRequest.get('Something');
     *     // => undefined
     *
     * Aliased as `mockRequest.header()`.
     *
     * @param {String} name
     * @return {String}
     * @api public
     */

    mockRequest.get =
    mockRequest.getHeader =
    mockRequest.header = function(name) {
        name = name.toLowerCase();
        switch (name) {
            case 'referer':
            case 'referrer':
                return mockRequest.headers.referrer || mockRequest.headers.referer;
            default:
                return mockRequest.headers[name];
        }
    };

    /**
     * Function: is
     *
     *   Checks for matching content types in the content-type header.
     *   Requires a request body, identified by transfer-encoding or content-length headers
     *
     * Examples:
     *
     *     mockRequest.headers['content-type'] = 'text/html';
     *     mockRequest.headers['transfer-encoding'] = 'chunked';
     *     mockRequest.headers['content-length'] = '100';
     *
     *     mockRequest.is('html');
     *     // => "html"
     *
     *     mockRequest.is('json');
     *     // => false
     *
     *     mockRequest.is(['json', 'html', 'text']);
     *     // => "html"
     *
     * @param {String|String[]} types content type or array of types to match
     * @return {String|false|null} Matching content type as string, false if no match, null if request has no body.
     * @api public
     */
    mockRequest.is = function(types) {
        if (!Array.isArray(types)) {
            types = [].slice.call(arguments);
        }
        return typeis(mockRequest, types);
    };

    /**
     * Function: accepts
     *
     *   Checks for matching content types in the Accept header.
     *
     * Examples:
     *
     *     mockRequest.headers['accept'] = 'application/json'
     *
     *     mockRequest.accepts('json');
     *     // => 'json'
     *
     *     mockRequest.accepts('html');
     *     // => false
     *
     *     mockRequest.accepts(['html', 'json']);
     *     // => 'json'
     *
     * @param  {String|String[]} types Mime type(s) to check against
     * @return {String|false}          Matching type or false if no match.
     */
    mockRequest.accepts = function(types) {
        var Accepts = accepts(mockRequest);
        return Accepts.type(types);
    };

    /**
     * Check if the given `encoding`s are accepted.
     *
     * @param {String} ...encoding
     * @return {String|Array}
     * @public
     */

    mockRequest.acceptsEncodings = function(encodings){
        if (!Array.isArray(encodings)) {
            encodings = [].slice.call(arguments);
        }

        var accept = accepts(mockRequest);
        return accept.encodings(encodings);
    };

    /**
     * Check if the given `charset`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...charset
     * @return {String|Array}
     * @public
     */

    mockRequest.acceptsCharsets = function(charsets){
        if (!Array.isArray(charsets)) {
            charsets = [].slice.call(arguments);
        }

        var accept = accepts(mockRequest);
        return accept.charsets(charsets);
    };

    /**
     * Check if the given `lang`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...lang
     * @return {String|Array}
     * @public
     */

    mockRequest.acceptsLanguages = function(languages){
        if (!Array.isArray(languages)) {
            languages = [].slice.call(arguments);
        }

        var accept = accepts(mockRequest);
        return accept.languages(languages);
    };

    /**
     * Function: range
     *
     * Parse Range header field, capping to the given `size`.
     *
     * Unspecified ranges such as "0-" require knowledge of your resource length. In
     * the case of a byte range this is of course the total number of bytes. If the
     * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
     * and `-2` when syntactically invalid.
     *
     * When ranges are returned, the array has a "type" property which is the type of
     * range that is required (most commonly, "bytes"). Each array element is an object
     * with a "start" and "end" property for the portion of the range.
     *
     * The "combine" option can be set to `true` and overlapping & adjacent ranges
     * will be combined into a single range.
     *
     * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
     * should respond with 4 users when available, not 3.
     *
     * @param {number} size
     * @param {object} [opts]
     * @param {boolean} [opts.combine=false]
     * @return {false|number|array}
     * @public
     */
    mockRequest.range = function(size, opts) {
        var range = mockRequest.get('Range');
        if (!range) {
            return;
        }
        return parseRange(size, range, opts);
    };

    /**
     * Function: param
     *
     *   Return the value of param name when present.
     *   Lookup is performed in the following order:
     *   - req.params
     *   - req.body
     *   - req.query
     */
    mockRequest.param = function(parameterName, defaultValue) {
        if (mockRequest.params.hasOwnProperty(parameterName)) {
            return mockRequest.params[parameterName];
        } else if (mockRequest.body.hasOwnProperty(parameterName)) {
            return mockRequest.body[parameterName];
        } else if (mockRequest.query.hasOwnProperty(parameterName)) {
            return mockRequest.query[parameterName];
        }
        return defaultValue;
    };

    /**
     * Function: _setParameter
     *
     *    Set parameters that the client can then get using the 'params'
     *    key.
     *
     * Parameters:
     *
     *   key - The key. For instance, 'bob' would be accessed: request.params.bob
     *   value - The value to return when accessed.
     */
    mockRequest._setParameter = function(key, value) {
        mockRequest.params[key] = value;
    };

    /**
     * Sets a variable that is stored in the session.
     *
     * @param variable The variable to store in the session
     * @param value    The value associated with the variable
     */
    mockRequest._setSessionVariable = function(variable, value) {
        if (typeof mockRequest.session !== 'object') {
            mockRequest.session = {};
        }
        mockRequest.session[variable] = value;
    };

    /**
     * Sets a variable that is stored in the cookies.
     *
     * @param variable The variable to store in the cookies
     * @param value    The value associated with the variable
     */
    mockRequest._setCookiesVariable = function(variable, value) {
        mockRequest.cookies[variable] = value;
    };

    /**
     * Sets a variable that is stored in the signed cookies.
     *
     * @param variable The variable to store in the signed cookies
     * @param value    The value associated with the variable
     */
    mockRequest._setSignedCookiesVariable = function(variable, value) {
        if (typeof mockRequest.signedCookies !== 'object') {
            mockRequest.signedCookies = {};
        }
        mockRequest.signedCookies[variable] = value;
    };

    /**
     * Sets a variable that is stored in the headers.
     *
     * @param variable The variable to store in the headers
     * @param value    The value associated with the variable
     */
    mockRequest._setHeadersVariable = function(variable, value) {
        variable = variable.toLowerCase();
        mockRequest.headers[variable] = value;
    };

    /**
     * Sets a variable that is stored in the files.
     *
     * @param variable The variable to store in the files
     * @param value    The value associated with the variable
     */
    mockRequest._setFilesVariable = function(variable, value) {
        mockRequest.files[variable] = value;
    };

    /**
     * Function: _setMethod
     *
     *    Sets the HTTP method that the client gets when the called the 'method'
     *    property. This defaults to 'GET' if it is not set.
     *
     * Parameters:
     *
     *   method - The HTTP method, e.g. GET, POST, PUT, DELETE, etc.
     *
     * Note: We don't validate the string. We just return it.
     */
    mockRequest._setMethod = function(method) {
        mockRequest.method = method;
    };

    /**
     * Function: _setURL
     *
     *    Sets the URL value that the client gets when the called the 'url'
     *    property.
     *
     * Parameters:
     *
     *   value - The request path, e.g. /my-route/452
     *
     * Note: We don't validate the string. We just return it. Typically, these
     * do not include hostname, port or that part of the URL.
     */
    mockRequest._setURL = function(value) {
        mockRequest.url = value;
    };

    /**
     * Function: _setBaseUrl
     *
     *    Sets the URL value that the client gets when the called the 'baseUrl'
     *    property.
     *
     * Parameters:
     *
     *   value - The request base path, e.g. /my-route
     *
     * Note: We don't validate the string. We just return it. Typically, these
     * do not include hostname, port or that part of the URL.
     */
    mockRequest._setBaseUrl = function(value) {
        mockRequest.baseUrl = value;
    };

    /**
     * Function: _setOriginalUrl
     *
     *    Sets the URL value that the client gets when the called the 'originalUrl'
     *    property.
     *
     * Parameters:
     *
     *   value - The request path, e.g. /my-route/452
     *
     * Note: We don't validate the string. We just return it. Typically, these
     * do not include hostname, port or that part of the URL.
     */
    mockRequest._setOriginalUrl = function(value) {
        mockRequest.originalUrl = value;
    };

    /**
     * Function: _setBody
     *
     *    Sets the body that the client gets when the called the 'body'
     *    parameter. This defaults to 'GET' if it is not set.
     *
     * Parameters:
     *
     *   body - An object representing the body.
     *
     * If you expect the 'body' to come from a form, this typically means that
     * it would be a flat object of properties and values, as in:
     *
     * > {  name: 'Howard Abrams',
     * >    age: 522
     * > }
     *
     * If the client is expecting a JSON object through a REST interface, then
     * this object could be anything.
     */
    mockRequest._setBody = function(body) {
        mockRequest.body = body;
    };

    /**
     * Function: _addBody
     *
     *    Adds another body parameter the client gets when calling the 'body'
     *    parameter with another property value, e.g. the name of a form element
     *    that was passed in.
     *
     * Parameters:
     *
     *   key - The key. For instance, 'bob' would be accessed: request.params.bob
     *   value - The value to return when accessed.
     */
    mockRequest._addBody = function(key, value) {
        mockRequest.body[key] = value;
    };


    /**
     * Function: send
     *
     *    Write data to the request stream which will trigger request's 'data', and 'end' event
     *
     * Parameters:
     *
     *   data - string, array, object, number, buffer
     */
    mockRequest.send = function(data) {

        if(Buffer.isBuffer(data)){
            this.emit('data', data);
        }else if(typeof data === 'object' || typeof data === 'number'){
            this.emit('data', Buffer.from(JSON.stringify(data)));
        }else if(typeof data === 'string'){
            this.emit('data', Buffer.from(data));
        }
        this.emit('end');
    };

    /**
     * Function: hostname
     *
     * If Hostname is not set explicitly, then derive it from the Host header without port information
     *
     */
    if (!mockRequest.hostname) {
        mockRequest.hostname = (function() {
            if (!mockRequest.headers.host) {
                return '';
            }

            var hostname = mockRequest.headers.host.split(':')[0].split('.');
            return hostname.join('.');
        }());
    }

    /**
     * Function: subdomains
     *
     *    Subdomains are the dot-separated parts of the host before the main domain of the app.
     *
     */
    mockRequest.subdomains = (function() {
        if (!mockRequest.headers.host) {
            return [];
        }

        var offset = 2;
        var subdomains = mockRequest.headers.host.split('.').reverse();

        return subdomains.slice(offset);
    }());

    return mockRequest;
}

module.exports.createRequest = createRequest;
