"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _apiUtils = require("../api-utils");
var _node = require("../api-utils/node");
var _requestMeta = require("../request-meta");
var _index = require("./index");
class NodeNextRequest extends _index.BaseNextRequest {
    get originalRequest() {
        // Need to mimic these changes to the original req object for places where we use it:
        // render.tsx, api/ssg requests
        this._req[_requestMeta.NEXT_REQUEST_META] = this[_requestMeta.NEXT_REQUEST_META];
        this._req.url = this.url;
        this._req.cookies = this.cookies;
        return this._req;
    }
    constructor(_req){
        super(_req.method.toUpperCase(), _req.url, _req);
        this._req = _req;
        this.headers = this._req.headers;
    }
    async parseBody(limit) {
        return (0, _node).parseBody(this._req, limit);
    }
}
exports.NodeNextRequest = NodeNextRequest;
class NodeNextResponse extends _index.BaseNextResponse {
    get originalResponse() {
        if (_apiUtils.SYMBOL_CLEARED_COOKIES in this) {
            this._res[_apiUtils.SYMBOL_CLEARED_COOKIES] = this[_apiUtils.SYMBOL_CLEARED_COOKIES];
        }
        return this._res;
    }
    constructor(_res){
        super(_res);
        this._res = _res;
        this.textBody = undefined;
    }
    get sent() {
        return this._res.finished || this._res.headersSent;
    }
    get statusCode() {
        return this._res.statusCode;
    }
    set statusCode(value) {
        this._res.statusCode = value;
    }
    get statusMessage() {
        return this._res.statusMessage;
    }
    set statusMessage(value) {
        this._res.statusMessage = value;
    }
    setHeader(name, value) {
        this._res.setHeader(name, value);
        return this;
    }
    getHeaderValues(name) {
        const values = this._res.getHeader(name);
        if (values === undefined) return undefined;
        return (Array.isArray(values) ? values : [
            values
        ]).map((value)=>value.toString()
        );
    }
    hasHeader(name) {
        return this._res.hasHeader(name);
    }
    getHeader(name) {
        const values = this.getHeaderValues(name);
        return Array.isArray(values) ? values.join(',') : undefined;
    }
    appendHeader(name, value) {
        var ref;
        const currentValues = (ref = this.getHeaderValues(name)) !== null && ref !== void 0 ? ref : [];
        if (!currentValues.includes(value)) {
            this._res.setHeader(name, [
                ...currentValues,
                value
            ]);
        }
        return this;
    }
    body(value) {
        this.textBody = value;
        return this;
    }
    send() {
        this._res.end(this.textBody);
    }
}
exports.NodeNextResponse = NodeNextResponse;

//# sourceMappingURL=node.js.map