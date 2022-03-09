"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.images = void 0;
var _lodashCurry = _interopRequireDefault(require("next/dist/compiled/lodash.curry"));
var _webpackConfig = require("../../../../webpack-config");
var _helpers = require("../../helpers");
var _utils = require("../../utils");
var _messages = require("./messages");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const images = (0, _lodashCurry).default(async function images(_ctx, config) {
    const fns = [
        (0, _helpers).loader({
            oneOf: [
                {
                    test: _webpackConfig.nextImageLoaderRegex,
                    use: {
                        loader: 'error-loader',
                        options: {
                            reason: (0, _messages).getCustomDocumentImageError()
                        }
                    },
                    issuer: /pages[\\/]_document\./
                }, 
            ]
        }), 
    ];
    const fn = (0, _utils).pipe(...fns);
    return fn(config);
});
exports.images = images;

//# sourceMappingURL=index.js.map