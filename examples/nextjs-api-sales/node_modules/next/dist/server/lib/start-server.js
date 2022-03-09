"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startServer = startServer;
var _log = require("../../build/output/log");
var _http = _interopRequireDefault(require("http"));
var _next = _interopRequireDefault(require("../next"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function startServer(opts) {
    let requestHandler;
    const server = _http.default.createServer((req, res)=>{
        return requestHandler(req, res);
    });
    return new Promise((resolve, reject)=>{
        let port = opts.port;
        let retryCount = 0;
        server.on('error', (err)=>{
            if (port && opts.allowRetry && err.code === 'EADDRINUSE' && retryCount < 10) {
                (0, _log).warn(`Port ${port} is in use, trying ${port + 1} instead.`);
                port += 1;
                retryCount += 1;
                server.listen(port, opts.hostname);
            } else {
                reject(err);
            }
        });
        server.on('listening', ()=>{
            const addr = server.address();
            const hostname = !opts.hostname || opts.hostname === '0.0.0.0' ? 'localhost' : opts.hostname;
            const app = (0, _next).default({
                ...opts,
                hostname,
                customServer: false,
                httpServer: server,
                port: addr && typeof addr === 'object' ? addr.port : port
            });
            requestHandler = app.getRequestHandler();
            resolve(app);
        });
        server.listen(port, opts.hostname);
    });
}

//# sourceMappingURL=start-server.js.map