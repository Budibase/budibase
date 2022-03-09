"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AmpStateContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AmpStateContext = _react.default.createContext({
});
exports.AmpStateContext = AmpStateContext;
if (process.env.NODE_ENV !== 'production') {
    AmpStateContext.displayName = 'AmpStateContext';
}

//# sourceMappingURL=amp-context.js.map