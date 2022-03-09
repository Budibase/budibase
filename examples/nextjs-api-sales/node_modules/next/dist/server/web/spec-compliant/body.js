"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.extractContentType = extractContentType;
exports.cloneBody = cloneBody;
exports.getInstanceBody = getInstanceBody;
exports.Body = void 0;
var _formData = require("../form-data");
var _utils = require("../utils");
var util = _interopRequireWildcard(require("../is"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const INTERNALS = Symbol('internal body');
class BaseBody {
    constructor(bodyInit){
        this[INTERNALS] = {
            bodyInit: bodyInit,
            disturbed: false
        };
        if (util.isFormData(bodyInit)) {
            this[INTERNALS].boundary = (0, _formData).getBoundary();
        }
    }
    get body() {
        const body = this[INTERNALS].bodyInit;
        if (!body) {
            return null;
        }
        const that = this;
        if (!this[INTERNALS].stream) {
            const readable = new ReadableStream({
                async start (controller) {
                    if (typeof body === 'string') {
                        const encoder = new TextEncoder();
                        controller.enqueue(encoder.encode(body));
                    } else if (util.isBlob(body)) {
                        const buffer = await body.arrayBuffer();
                        controller.enqueue(new Uint8Array(buffer));
                    } else if (util.isDataView(body)) {
                        controller.enqueue(body);
                    } else if (util.isArrayBuffer(body)) {
                        controller.enqueue(body);
                    } else if (util.isArrayBufferView(body)) {
                        controller.enqueue(body);
                    } else if (util.isURLSearchParams(body)) {
                        const encoder = new TextEncoder();
                        controller.enqueue(encoder.encode(body.toString()));
                    } else if (util.isFormData(body)) {
                        for await (const chunk of (0, _formData).formDataIterator(body, that[INTERNALS].boundary)){
                            controller.enqueue(chunk);
                        }
                    } else if (util.isReadableStream(body)) {
                        for await (const chunk of (0, _utils).streamToIterator(body)){
                            if (chunk.length) {
                                controller.enqueue(chunk);
                            }
                        }
                    } else {
                        const text = Object.prototype.toString.call(body);
                        const encoder = new TextEncoder();
                        controller.enqueue(encoder.encode(text));
                    }
                    controller.close();
                }
            });
            // Spy on reading chunks to set the stream as disturbed
            const getReader = readable.getReader.bind(readable);
            readable.getReader = ()=>{
                const reader = getReader();
                const read = reader.read.bind(reader);
                reader.read = ()=>{
                    this[INTERNALS].disturbed = true;
                    return read();
                };
                return reader;
            };
            this[INTERNALS].stream = readable;
        }
        return this[INTERNALS].stream;
    }
    get bodyUsed() {
        return this[INTERNALS].disturbed;
    }
    _consume() {
        if (this[INTERNALS].disturbed) {
            return Promise.reject(new TypeError(`Body has already been used. It can only be used once. Use tee() first if you need to read it twice.`));
        }
        this[INTERNALS].disturbed = true;
        const body = this.body;
        return new Promise((resolve, reject)=>{
            let buffer = new Uint8Array(0);
            if (!body) {
                return resolve(buffer);
            }
            const reader = body.getReader();
            (function pump() {
                reader.read().then(({ value , done  })=>{
                    if (done) {
                        return resolve(buffer);
                    } else if (value) {
                        const merge = new Uint8Array(buffer.length + value.length);
                        merge.set(buffer);
                        merge.set(value, buffer.length);
                        buffer = merge;
                    }
                    pump();
                }, reject);
            })();
        });
    }
    async arrayBuffer() {
        const buffer = await this._consume();
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for(let i = 0; i < buffer.length; ++i){
            view[i] = buffer[i];
        }
        return arrayBuffer;
    }
    async blob() {
        const buffer = await this._consume();
        return new Blob([
            buffer
        ]);
    }
    async formData() {
        const bodyInit = this[INTERNALS].bodyInit;
        if (util.isURLSearchParams(bodyInit)) {
            const form = new FormData();
            for (const [key, value] of bodyInit){
                form.append(key, value);
            }
            return form;
        } else if (util.isFormData(bodyInit)) {
            return bodyInit;
        } else {
            throw new TypeError(`Unrecognized Content-Type header value. FormData can only parse the following MIME types: multipart/form-data, application/x-www-form-urlencoded.`);
        }
    }
    async text() {
        const decoder = new TextDecoder();
        const buffer = await this._consume();
        return decoder.decode(buffer);
    }
    async json() {
        const text = await this.text();
        try {
            return JSON.parse(text);
        } catch (err) {
            throw new TypeError(`invalid json body reason: ${err.message}`);
        }
    }
}
exports.Body = BaseBody;
function extractContentType(instance) {
    const body = instance[INTERNALS].bodyInit;
    if (typeof body === 'string') {
        return 'text/plain;charset=UTF-8';
    } else if (util.isBlob(body)) {
        return body.type;
    } else if (util.isDataView(body)) {
        return null;
    } else if (util.isArrayBuffer(body)) {
        return null;
    } else if (util.isArrayBufferView(body)) {
        return null;
    } else if (util.isURLSearchParams(body)) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
    } else if (util.isFormData(body)) {
        return `multipart/form-data;boundary=${instance[INTERNALS].boundary}`;
    } else if (util.isReadableStream(body)) {
        return null;
    } else {
        return 'text/plain;charset=UTF-8';
    }
}
function cloneBody(instance) {
    if (instance.bodyUsed) {
        throw new Error('cannot clone body after it is used');
    }
    const body = instance[INTERNALS].bodyInit;
    if (util.isReadableStream(body)) {
        const [r1, r2] = body.tee();
        instance[INTERNALS].bodyInit = r1;
        return r2;
    }
    return body || null;
}
function getInstanceBody(instance) {
    return instance[INTERNALS].bodyInit;
}

//# sourceMappingURL=body.js.map