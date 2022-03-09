"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
require("./node-polyfill-fetch");
var log = _interopRequireWildcard(require("../build/output/log"));
var _config = _interopRequireDefault(require("./config"));
var _path = require("path");
var _constants = require("../lib/constants");
var _constants1 = require("../shared/lib/constants");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
let ServerImpl;
const getServerImpl = async ()=>{
    if (ServerImpl === undefined) ServerImpl = (await Promise.resolve(require('./next-server'))).default;
    return ServerImpl;
};
class NextServer {
    constructor(options){
        this.options = options;
    }
    get hostname() {
        return this.options.hostname;
    }
    get port() {
        return this.options.port;
    }
    getRequestHandler() {
        return async (req, res, parsedUrl)=>{
            const requestHandler = await this.getServerRequestHandler();
            return requestHandler(req, res, parsedUrl);
        };
    }
    setAssetPrefix(assetPrefix) {
        if (this.server) {
            this.server.setAssetPrefix(assetPrefix);
        } else {
            this.preparedAssetPrefix = assetPrefix;
        }
    }
    logError(...args) {
        if (this.server) {
            this.server.logError(...args);
        }
    }
    async render(...args) {
        const server = await this.getServer();
        return server.render(...args);
    }
    async renderToHTML(...args) {
        const server = await this.getServer();
        return server.renderToHTML(...args);
    }
    async renderError(...args) {
        const server = await this.getServer();
        return server.renderError(...args);
    }
    async renderErrorToHTML(...args) {
        const server = await this.getServer();
        return server.renderErrorToHTML(...args);
    }
    async render404(...args) {
        const server = await this.getServer();
        return server.render404(...args);
    }
    async serveStatic(...args) {
        const server = await this.getServer();
        return server.serveStatic(...args);
    }
    async prepare() {
        const server = await this.getServer();
        return server.prepare();
    }
    async close() {
        const server = await this.getServer();
        return server.close();
    }
    async createServer(options) {
        if (options.dev) {
            const DevServer = require('./dev/next-dev-server').default;
            return new DevServer(options);
        }
        const ServerImplementation = await getServerImpl();
        return new ServerImplementation(options);
    }
    async loadConfig() {
        const phase = this.options.dev ? _constants1.PHASE_DEVELOPMENT_SERVER : _constants1.PHASE_PRODUCTION_SERVER;
        const dir = (0, _path).resolve(this.options.dir || '.');
        const conf = await (0, _config).default(phase, dir, this.options.conf);
        return conf;
    }
    async getServer() {
        if (!this.serverPromise) {
            setTimeout(getServerImpl, 10);
            this.serverPromise = this.loadConfig().then(async (conf)=>{
                this.server = await this.createServer({
                    ...this.options,
                    conf
                });
                if (this.preparedAssetPrefix) {
                    this.server.setAssetPrefix(this.preparedAssetPrefix);
                }
                return this.server;
            });
        }
        return this.serverPromise;
    }
    async getServerRequestHandler() {
        // Memoize request handler creation
        if (!this.reqHandlerPromise) {
            this.reqHandlerPromise = this.getServer().then((server)=>server.getRequestHandler().bind(server)
            );
        }
        return this.reqHandlerPromise;
    }
}
exports.NextServer = NextServer;
// This file is used for when users run `require('next')`
function createServer(options) {
    if (options == null) {
        throw new Error('The server has not been instantiated properly. https://nextjs.org/docs/messages/invalid-server-options');
    }
    if (!('isNextDevCommand' in options) && process.env.NODE_ENV && ![
        'production',
        'development',
        'test'
    ].includes(process.env.NODE_ENV)) {
        log.warn(_constants.NON_STANDARD_NODE_ENV);
    }
    if (options.dev && typeof options.dev !== 'boolean') {
        console.warn("Warning: 'dev' is not a boolean which could introduce unexpected behavior. https://nextjs.org/docs/messages/invalid-server-options");
    }
    return new NextServer(options);
}
// Support commonjs `require('next')`
module.exports = createServer;
exports = module.exports;
var _default = createServer;
exports.default = _default;

//# sourceMappingURL=next.js.map