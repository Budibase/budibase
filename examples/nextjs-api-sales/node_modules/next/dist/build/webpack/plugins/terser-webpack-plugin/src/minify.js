"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.minify = minify;
var _terser = _interopRequireDefault(require("next/dist/compiled/terser"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function buildTerserOptions(terserOptions = {
}) {
    return {
        ...terserOptions,
        mangle: terserOptions.mangle == null ? true : typeof terserOptions.mangle === 'boolean' ? terserOptions.mangle : {
            ...terserOptions.mangle
        },
        // Ignoring sourceMap from options
        // eslint-disable-next-line no-undefined
        sourceMap: undefined,
        // the `output` option is deprecated
        ...terserOptions.format ? {
            format: {
                beautify: false,
                ...terserOptions.format
            }
        } : {
            output: {
                beautify: false,
                ...terserOptions.output
            }
        }
    };
}
async function minify(options) {
    const { name , input , inputSourceMap , terserOptions  } = options;
    // Copy terser options
    const opts = buildTerserOptions(terserOptions);
    // Let terser generate a SourceMap
    if (inputSourceMap) {
        // @ts-ignore
        opts.sourceMap = {
            asObject: true
        };
    }
    const result = await _terser.default.minify({
        [name]: input
    }, opts);
    return result;
}

//# sourceMappingURL=minify.js.map