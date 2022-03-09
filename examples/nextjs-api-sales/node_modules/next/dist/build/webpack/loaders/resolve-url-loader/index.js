"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resolveUrlLoader;
var _sourceMap = require("next/dist/compiled/source-map");
var _valueProcessor = _interopRequireDefault(require("./lib/value-processor"));
var _joinFunction = require("./lib/join-function");
var _postcss = _interopRequireDefault(require("./lib/postcss"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function resolveUrlLoader(content, sourceMap) {
    const options = Object.assign({
        sourceMap: this.sourceMap,
        silent: false,
        absolute: false,
        keepQuery: false,
        root: false,
        debug: false,
        join: _joinFunction.defaultJoin
    }, this.getOptions());
    let sourceMapConsumer;
    if (sourceMap) {
        sourceMapConsumer = new _sourceMap.SourceMapConsumer(sourceMap);
    }
    const callback = this.async();
    const { postcss  } = await options.postcss();
    (0, _postcss).default(postcss, this.resourcePath, content, {
        outputSourceMap: Boolean(options.sourceMap),
        transformDeclaration: (0, _valueProcessor).default(this.resourcePath, options),
        inputSourceMap: sourceMap,
        sourceMapConsumer: sourceMapConsumer
    }).catch(onFailure).then(onSuccess);
    function onFailure(error) {
        callback(encodeError('CSS error', error));
    }
    function onSuccess(reworked) {
        if (reworked) {
            // complete with source-map
            //  source-map sources are relative to the file being processed
            if (options.sourceMap) {
                callback(null, reworked.content, reworked.map);
            } else {
                callback(null, reworked.content);
            }
        }
    }
    function encodeError(label, exception) {
        return new Error([
            'resolve-url-loader',
            ': ',
            [
                label
            ].concat(typeof exception === 'string' && exception || exception instanceof Error && [
                exception.message,
                exception.stack.split('\n')[1].trim(), 
            ] || []).filter(Boolean).join('\n  '), 
        ].join(''));
    }
}

//# sourceMappingURL=index.js.map