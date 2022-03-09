"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _hotDevClient = _interopRequireDefault(require("./error-overlay/hot-dev-client"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = ()=>{
    const devClient = (0, _hotDevClient).default();
    devClient.subscribeToHmrEvent((obj)=>{
        if (obj.action === 'reloadPage') {
            return window.location.reload();
        }
        if (obj.action === 'removedPage') {
            const [page] = obj.data;
            if (page === window.next.router.pathname) {
                return window.location.reload();
            }
            return;
        }
        if (obj.action === 'addedPage') {
            const [page] = obj.data;
            if (page === window.next.router.pathname && typeof window.next.router.components[page] === 'undefined') {
                return window.location.reload();
            }
            return;
        }
        throw new Error('Unexpected action ' + obj.action);
    });
    return devClient;
};
exports.default = _default;

//# sourceMappingURL=webpack-hot-middleware-client.js.map