"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Request = exports.INTERNALS = void 0;
var _body = require("./body");
var _headers = require("./headers");
var _nextUrl = require("../next-url");
var _utils = require("../utils");
const INTERNALS = Symbol('internal request');
exports.INTERNALS = INTERNALS;
class BaseRequest extends _body.Body {
    constructor(input, init = {
    }){
        var ref;
        var ref1;
        const method = (ref1 = (ref = init.method) === null || ref === void 0 ? void 0 : ref.toUpperCase()) !== null && ref1 !== void 0 ? ref1 : 'GET';
        if ((method === 'GET' || method === 'HEAD') && (init.body || input instanceof BaseRequest && (0, _body).getInstanceBody(input))) {
            throw new TypeError('Request with GET/HEAD method cannot have body');
        }
        let inputBody = null;
        if (init.body) {
            inputBody = init.body;
        } else if (input instanceof BaseRequest && (0, _body).getInstanceBody(input)) {
            inputBody = (0, _body).cloneBody(input);
        }
        super(inputBody);
        const headers = new _headers.Headers(init.headers || getProp(input, 'headers') || {
        });
        if (inputBody !== null) {
            const contentType = (0, _body).extractContentType(this);
            if (contentType !== null && !headers.has('Content-Type')) {
                headers.append('Content-Type', contentType);
            }
        }
        this[INTERNALS] = {
            credentials: init.credentials || getProp(input, 'credentials') || 'same-origin',
            headers,
            method,
            referrer: init.referrer || 'about:client',
            redirect: init.redirect || getProp(input, 'redirect') || 'follow',
            url: new _nextUrl.NextURL(typeof input === 'string' ? input : input.url)
        };
    }
    get url() {
        return this[INTERNALS].url.toString();
    }
    get credentials() {
        return this[INTERNALS].credentials;
    }
    get method() {
        return this[INTERNALS].method;
    }
    get referrer() {
        return this[INTERNALS].referrer;
    }
    get headers() {
        return this[INTERNALS].headers;
    }
    get redirect() {
        return this[INTERNALS].redirect;
    }
    clone() {
        return new BaseRequest(this);
    }
    get cache() {
        return (0, _utils).notImplemented('Request', 'cache');
    }
    get integrity() {
        return (0, _utils).notImplemented('Request', 'integrity');
    }
    get keepalive() {
        return (0, _utils).notImplemented('Request', 'keepalive');
    }
    get mode() {
        return (0, _utils).notImplemented('Request', 'mode');
    }
    get destination() {
        return (0, _utils).notImplemented('Request', 'destination');
    }
    get referrerPolicy() {
        return (0, _utils).notImplemented('Request', 'referrerPolicy');
    }
    get signal() {
        return (0, _utils).notImplemented('Request', 'signal');
    }
    get [Symbol.toStringTag]() {
        return 'Request';
    }
}
exports.Request = BaseRequest;
function getProp(input, key) {
    return input instanceof BaseRequest ? input[key] : undefined;
}

//# sourceMappingURL=request.js.map