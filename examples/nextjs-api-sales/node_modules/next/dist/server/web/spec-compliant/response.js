"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Response = void 0;
var _body = require("./body");
var _nextUrl = require("../next-url");
var _utils = require("../utils");
const INTERNALS = Symbol('internal response');
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
class BaseResponse extends _body.Body {
    constructor(body, init){
        super(body);
        this[INTERNALS] = {
            headers: new Headers(init === null || init === void 0 ? void 0 : init.headers),
            status: (init === null || init === void 0 ? void 0 : init.status) || 200,
            statusText: (init === null || init === void 0 ? void 0 : init.statusText) || '',
            type: 'default',
            url: (init === null || init === void 0 ? void 0 : init.url) ? new _nextUrl.NextURL(init.url) : undefined
        };
        if (this[INTERNALS].status < 200 || this[INTERNALS].status > 599) {
            throw new RangeError(`Responses may only be constructed with status codes in the range 200 to 599, inclusive.`);
        }
        if (body !== null && !this[INTERNALS].headers.has('Content-Type')) {
            const contentType = (0, _body).extractContentType(this);
            if (contentType) {
                this[INTERNALS].headers.append('Content-Type', contentType);
            }
        }
    }
    static redirect(url, status = 307) {
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response((0, _utils).validateURL(url), {
            headers: {
                Location: url
            },
            status
        });
    }
    static error() {
        const response = new BaseResponse(null, {
            status: 0,
            statusText: ''
        });
        response[INTERNALS].type = 'error';
        return response;
    }
    get url() {
        var ref;
        return ((ref = this[INTERNALS].url) === null || ref === void 0 ? void 0 : ref.toString()) || '';
    }
    get ok() {
        return this[INTERNALS].status >= 200 && this[INTERNALS].status < 300;
    }
    get status() {
        return this[INTERNALS].status;
    }
    get statusText() {
        return this[INTERNALS].statusText;
    }
    get headers() {
        return this[INTERNALS].headers;
    }
    get redirected() {
        return this[INTERNALS].status > 299 && this[INTERNALS].status < 400 && this[INTERNALS].headers.has('Location');
    }
    get type() {
        return this[INTERNALS].type;
    }
    clone() {
        return new BaseResponse((0, _body).cloneBody(this), {
            headers: this.headers,
            status: this.status,
            statusText: this.statusText,
            url: this.url
        });
    }
    get [Symbol.toStringTag]() {
        return 'Response';
    }
}
exports.Response = BaseResponse;

//# sourceMappingURL=response.js.map