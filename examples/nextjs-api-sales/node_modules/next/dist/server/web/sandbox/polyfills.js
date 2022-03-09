"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.atob = atob;
exports.btoa = btoa;
Object.defineProperty(exports, "CryptoKey", {
    enumerable: true,
    get: function() {
        return _webcrypto.CryptoKey;
    }
});
Object.defineProperty(exports, "ReadableStream", {
    enumerable: true,
    get: function() {
        return _readableStream.ReadableStream;
    }
});
var _webcrypto = require("next/dist/compiled/@peculiar/webcrypto");
var _uuid = require("next/dist/compiled/uuid");
var _readableStream = require("./readable-stream");
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function atob(b64Encoded) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
}
function btoa(str) {
    return Buffer.from(str, 'binary').toString('base64');
}
class Crypto extends _webcrypto.Crypto {
    constructor(...args){
        super(...args);
        // @ts-ignore Remove once types are updated and we deprecate node 12
        this.randomUUID = _crypto.default.randomUUID || _uuid.v4;
    }
}
exports.Crypto = Crypto;

//# sourceMappingURL=polyfills.js.map