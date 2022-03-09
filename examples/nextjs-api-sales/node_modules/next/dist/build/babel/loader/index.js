"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _transform = _interopRequireDefault(require("./transform"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function nextBabelLoader(parentTrace, inputSource, inputSourceMap) {
    const filename = this.resourcePath;
    const target = this.target;
    const loaderOptions = parentTrace.traceChild('get-options')// @ts-ignore TODO: remove ignore once webpack 5 types are used
    .traceFn(()=>this.getOptions()
    );
    const loaderSpanInner = parentTrace.traceChild('next-babel-turbo-transform');
    const { code: transformedSource , map: outputSourceMap  } = loaderSpanInner.traceFn(()=>_transform.default.call(this, inputSource, inputSourceMap, loaderOptions, filename, target, loaderSpanInner)
    );
    return [
        transformedSource,
        outputSourceMap
    ];
}
const nextBabelLoaderOuter = function nextBabelLoaderOuter(inputSource, inputSourceMap) {
    const callback = this.async();
    const loaderSpan = this.currentTraceSpan.traceChild('next-babel-turbo-loader');
    loaderSpan.traceAsyncFn(()=>nextBabelLoader.call(this, loaderSpan, inputSource, inputSourceMap)
    ).then(([transformedSource, outputSourceMap])=>{
        return callback === null || callback === void 0 ? void 0 : callback(null, transformedSource, outputSourceMap || inputSourceMap);
    }, (err)=>{
        callback === null || callback === void 0 ? void 0 : callback(err);
    });
};
var _default = nextBabelLoaderOuter;
exports.default = _default;

//# sourceMappingURL=index.js.map