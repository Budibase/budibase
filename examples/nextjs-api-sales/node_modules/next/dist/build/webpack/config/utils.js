"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pipe = void 0;
const pipe = (...fns)=>(param)=>fns.reduce(async (result, next)=>next(await result)
        , param)
;
exports.pipe = pipe;

//# sourceMappingURL=utils.js.map