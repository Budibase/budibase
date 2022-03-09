"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getOnline = getOnline;
var _childProcess = require("child_process");
var _dns = _interopRequireDefault(require("dns"));
var _url = _interopRequireDefault(require("url"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getProxy() {
    if (process.env.https_proxy) {
        return process.env.https_proxy;
    }
    try {
        const httpsProxy = (0, _childProcess).execSync('npm config get https-proxy').toString().trim();
        return httpsProxy !== 'null' ? httpsProxy : undefined;
    } catch (e) {
        return;
    }
}
function getOnline() {
    return new Promise((resolve)=>{
        _dns.default.lookup('registry.yarnpkg.com', (registryErr)=>{
            if (!registryErr) {
                return resolve(true);
            }
            const proxy = getProxy();
            if (!proxy) {
                return resolve(false);
            }
            const { hostname  } = _url.default.parse(proxy);
            if (!hostname) {
                return resolve(false);
            }
            _dns.default.lookup(hostname, (proxyErr)=>{
                resolve(proxyErr == null);
            });
        });
    });
}

//# sourceMappingURL=get-online.js.map