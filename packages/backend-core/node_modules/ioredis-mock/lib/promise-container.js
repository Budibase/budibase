"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let promise = global.Promise;
const promiseContainer = {
  get: () => promise,
  set: lib => {
    if (typeof lib !== 'function') {
      throw new Error(`Provided Promise must be a function, got ${lib}`);
    }

    promise = lib;
  }
};
var _default = promiseContainer;
exports.default = _default;