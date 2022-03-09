"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useRefreshRoot = useRefreshRoot;
exports.RefreshContext = void 0;
var _react = require("react");
const RefreshContext = (0, _react).createContext((_)=>{
});
exports.RefreshContext = RefreshContext;
function useRefreshRoot() {
    return (0, _react).useContext(RefreshContext);
}

//# sourceMappingURL=refresh.js.map