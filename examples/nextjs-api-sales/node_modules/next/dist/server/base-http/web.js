"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _index = require("./index");
class WebNextRequest extends _index.BaseNextRequest {
    constructor(request){
        const url = new URL(request.url);
        super(request.method, url.href.slice(url.origin.length), request.clone().body);
        this.request = request;
        this.headers = {
        };
        for (const [name, value] of request.headers.entries()){
            this.headers[name] = value;
        }
    }
    async parseBody(_limit) {
        throw new Error('parseBody is not implemented in the web runtime');
    }
}
exports.WebNextRequest = WebNextRequest;
class WebNextResponse extends _index.BaseNextResponse {
    get sent() {
        return this._sent;
    }
    constructor(transformStream = new TransformStream()){
        super(transformStream.writable);
        this.transformStream = transformStream;
        this.headers = new Headers();
        this.textBody = undefined;
        this._sent = false;
        this.sendPromise = new Promise((resolve)=>{
            this.sendResolve = resolve;
        });
        this.response = this.sendPromise.then(()=>{
            var _textBody;
            return new Response((_textBody = this.textBody) !== null && _textBody !== void 0 ? _textBody : this.transformStream.readable, {
                headers: this.headers,
                status: this.statusCode,
                statusText: this.statusMessage
            });
        });
    }
    setHeader(name, value) {
        this.headers.delete(name);
        for (const val of Array.isArray(value) ? value : [
            value
        ]){
            this.headers.append(name, val);
        }
        return this;
    }
    getHeaderValues(name) {
        var ref;
        // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get#example
        return (ref = this.getHeader(name)) === null || ref === void 0 ? void 0 : ref.split(',').map((v)=>v.trimStart()
        );
    }
    getHeader(name) {
        var ref;
        return (ref = this.headers.get(name)) !== null && ref !== void 0 ? ref : undefined;
    }
    hasHeader(name) {
        return this.headers.has(name);
    }
    appendHeader(name, value) {
        this.headers.append(name, value);
        return this;
    }
    body(value) {
        this.textBody = value;
        return this;
    }
    send() {
        var _obj, ref;
        (ref = (_obj = this).sendResolve) === null || ref === void 0 ? void 0 : ref.call(_obj);
        this._sent = true;
    }
    toResponse() {
        return this.response;
    }
}
exports.WebNextResponse = WebNextResponse;

//# sourceMappingURL=web.js.map