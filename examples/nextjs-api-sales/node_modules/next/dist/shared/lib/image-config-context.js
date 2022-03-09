"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageConfigContext = void 0;
var _react = _interopRequireDefault(require("react"));
var _imageConfig = require("../../server/image-config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ImageConfigContext = _react.default.createContext(_imageConfig.imageConfigDefault);
exports.ImageConfigContext = ImageConfigContext;
if (process.env.NODE_ENV !== 'production') {
    ImageConfigContext.displayName = 'ImageConfigContext';
}

//# sourceMappingURL=image-config-context.js.map