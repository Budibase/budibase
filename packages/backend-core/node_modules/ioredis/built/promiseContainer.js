"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
exports.isPromise = isPromise;
let promise = Promise;
function get() {
    return promise;
}
exports.get = get;
function set(lib) {
    if (typeof lib !== "function") {
        throw new Error(`Provided Promise must be a function, got ${lib}`);
    }
    promise = lib;
}
exports.set = set;
