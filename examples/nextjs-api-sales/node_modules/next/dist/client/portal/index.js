"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Portal = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = require("react-dom");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Portal = ({ children , type  })=>{
    let portalNode = _react.default.useRef(null);
    let [, forceUpdate] = _react.default.useState();
    _react.default.useEffect(()=>{
        portalNode.current = document.createElement(type);
        document.body.appendChild(portalNode.current);
        forceUpdate({
        });
        return ()=>{
            if (portalNode.current) {
                document.body.removeChild(portalNode.current);
            }
        };
    }, [
        type
    ]);
    return portalNode.current ? /*#__PURE__*/ (0, _reactDom).createPortal(children, portalNode.current) : null;
};
exports.Portal = Portal;

//# sourceMappingURL=index.js.map