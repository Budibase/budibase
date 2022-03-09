"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.waitUntilSymbol = exports.passThroughSymbol = exports.responseSymbol = void 0;
var _key, _key1;
const responseSymbol = Symbol('response');
exports.responseSymbol = responseSymbol;
const passThroughSymbol = Symbol('passThrough');
exports.passThroughSymbol = passThroughSymbol;
const waitUntilSymbol = Symbol('waitUntil');
exports.waitUntilSymbol = waitUntilSymbol;
class FetchEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_request){
        this[_key] = [];
        this[_key1] = false;
    }
    respondWith(response) {
        if (!this[responseSymbol]) {
            this[responseSymbol] = Promise.resolve(response);
        }
    }
    passThroughOnException() {
        this[passThroughSymbol] = true;
    }
    waitUntil(promise) {
        this[waitUntilSymbol].push(promise);
    }
}
exports.FetchEvent = FetchEvent;
_key = waitUntilSymbol;
_key1 = passThroughSymbol;

//# sourceMappingURL=fetch-event.js.map