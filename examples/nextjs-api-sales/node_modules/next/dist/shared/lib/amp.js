"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInAmpMode = isInAmpMode;
exports.useAmp = useAmp;
var _react = _interopRequireDefault(require("react"));
var _ampContext = require("./amp-context");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isInAmpMode({ ampFirst =false , hybrid =false , hasQuery =false ,  } = {
}) {
    return ampFirst || hybrid && hasQuery;
}
function useAmp() {
    // Don't assign the context value to a variable to save bytes
    return isInAmpMode(_react.default.useContext(_ampContext.AmpStateContext));
}

//# sourceMappingURL=amp.js.map