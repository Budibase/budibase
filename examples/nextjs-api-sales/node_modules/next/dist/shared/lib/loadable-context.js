"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LoadableContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const LoadableContext = _react.default.createContext(null);
exports.LoadableContext = LoadableContext;
if (process.env.NODE_ENV !== 'production') {
    LoadableContext.displayName = 'LoadableContext';
}

//# sourceMappingURL=loadable-context.js.map