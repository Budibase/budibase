"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _miniCssExtractPlugin = _interopRequireDefault(require("next/dist/compiled/mini-css-extract-plugin"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class NextMiniCssExtractPlugin extends _miniCssExtractPlugin.default {
    constructor(...args){
        super(...args);
        this.__next_css_remove = true;
    }
}
exports.default = NextMiniCssExtractPlugin;

//# sourceMappingURL=mini-css-extract-plugin.js.map