"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RouterContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const RouterContext = _react.default.createContext(null);
exports.RouterContext = RouterContext;
if (process.env.NODE_ENV !== 'production') {
    RouterContext.displayName = 'RouterContext';
}

//# sourceMappingURL=router-context.js.map