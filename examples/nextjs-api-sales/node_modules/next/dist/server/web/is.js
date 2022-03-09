"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isArrayBuffer = isArrayBuffer;
exports.isArrayBufferView = isArrayBufferView;
exports.isDataView = isDataView;
exports.isURLSearchParams = isURLSearchParams;
exports.isBlob = isBlob;
exports.isFormData = isFormData;
exports.isReadableStream = isReadableStream;
exports.isIterable = isIterable;
function isArrayBuffer(value) {
    return ArrayBuffer.prototype.isPrototypeOf(value);
}
function isArrayBufferView(value) {
    return ArrayBuffer.isView(value);
}
function isDataView(value) {
    return DataView.prototype.isPrototypeOf(value);
}
function isURLSearchParams(value) {
    return URLSearchParams.prototype.isPrototypeOf(value);
}
function isBlob(value) {
    return Blob.prototype.isPrototypeOf(value);
}
function isFormData(value) {
    return FormData.prototype.isPrototypeOf(value);
}
function isReadableStream(value) {
    return value && (ReadableStream.prototype.isPrototypeOf(value) || value.constructor.name === 'ReadableStream' && 'getReader' in value);
}
function isIterable(object) {
    return object && Symbol.iterator in object && typeof object[Symbol.iterator] === 'function';
}

//# sourceMappingURL=is.js.map