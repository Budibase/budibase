"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setGlobal = exports.traceGlobals = void 0;
const traceGlobals = new Map();
exports.traceGlobals = traceGlobals;
const setGlobal = (key, val)=>{
    traceGlobals.set(key, val);
};
exports.setGlobal = setGlobal;

//# sourceMappingURL=shared.js.map