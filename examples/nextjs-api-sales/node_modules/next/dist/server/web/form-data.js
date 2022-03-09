"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBoundary = getBoundary;
exports.formDataIterator = formDataIterator;
exports.getFormDataLength = getFormDataLength;
var _is = require("./is");
var _utils = require("./utils");
const carriage = '\r\n';
const dashes = '--';
const carriageLength = 2;
function escape(str) {
    return str.replace(/"/g, '\\"');
}
function getFooter(boundary) {
    return `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
}
function getHeader(boundary, name, field) {
    let header = '';
    header += `${dashes}${boundary}${carriage}`;
    header += `Content-Disposition: form-data; name="${escape(name)}"`;
    if ((0, _is).isBlob(field)) {
        header += `; filename="${escape(field.name)}"${carriage}`;
        header += `Content-Type: ${field.type || 'application/octet-stream'}`;
    }
    return `${header}${carriage.repeat(2)}`;
}
function getBoundary() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    let str = '';
    for(var i = 0; i < array.length; i++){
        str += array[i].toString(16).padStart(2, '0');
    }
    return str;
}
async function* formDataIterator(form, boundary) {
    const encoder = new TextEncoder();
    for (const [name, value] of form){
        yield encoder.encode(getHeader(boundary, name, value));
        if ((0, _is).isBlob(value)) {
            const stream = value.stream();
            yield* (0, _utils).streamToIterator(stream);
        } else {
            yield encoder.encode(value);
        }
        yield encoder.encode(carriage);
    }
    yield encoder.encode(getFooter(boundary));
}
function getFormDataLength(form, boundary) {
    let length = 0;
    for (const [name, value] of form){
        length += Buffer.byteLength(getHeader(boundary, name, value));
        length += (0, _is).isBlob(value) ? value.size : Buffer.byteLength(String(value));
        length += carriageLength;
    }
    length += Buffer.byteLength(getFooter(boundary));
    return length;
}

//# sourceMappingURL=form-data.js.map