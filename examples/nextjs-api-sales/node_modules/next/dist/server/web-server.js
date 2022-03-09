"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _baseServer = _interopRequireDefault(require("./base-server"));
var _render = require("./render");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class NextWebServer extends _baseServer.default {
    constructor(options){
        super(options);
        this.webServerConfig = options.webServerConfig;
        Object.assign(this.renderOpts, options.webServerConfig.extendRenderOpts);
    }
    generateRewrites() {
        // @TODO: assuming minimal mode right now
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: []
        };
    }
    handleCompression() {
    // @TODO
    }
    getRoutesManifest() {
        return {
            headers: [],
            rewrites: {
                fallback: [],
                afterFiles: [],
                beforeFiles: []
            },
            redirects: []
        };
    }
    getPagePath() {
        // @TODO
        return '';
    }
    getPublicDir() {
        // @TODO
        return '';
    }
    getBuildId() {
        return globalThis.__server_context.buildId;
    }
    loadEnvConfig() {
    // @TODO
    }
    getHasStaticDir() {
        return false;
    }
    async hasMiddleware() {
        return false;
    }
    generateImageRoutes() {
        return [];
    }
    generateStaticRoutes() {
        return [];
    }
    generateFsStaticRoutes() {
        return [];
    }
    generatePublicRoutes() {
        return [];
    }
    getMiddleware() {
        return [];
    }
    generateCatchAllMiddlewareRoute() {
        return undefined;
    }
    getFontManifest() {
        return undefined;
    }
    getMiddlewareManifest() {
        return undefined;
    }
    getPagesManifest() {
        return {
            [globalThis.__server_context.page]: ''
        };
    }
    getFilesystemPaths() {
        return new Set();
    }
    getPrerenderManifest() {
        return {
            version: 3,
            routes: {
            },
            dynamicRoutes: {
            },
            notFoundRoutes: [],
            preview: {
                previewModeId: '',
                previewModeSigningKey: '',
                previewModeEncryptionKey: ''
            }
        };
    }
    getServerComponentManifest() {
        // @TODO: Need to return `extendRenderOpts.serverComponentManifest` here.
        return undefined;
    }
    async renderHTML(req, _res, pathname, query, renderOpts) {
        return (0, _render).renderToHTML({
            url: pathname,
            cookies: req.cookies,
            headers: req.headers
        }, {
        }, pathname, query, {
            ...renderOpts,
            supportsDynamicHTML: true,
            disableOptimizedLoading: true,
            runtime: 'edge'
        });
    }
    async sendRenderResult(_req, res, options) {
        // @TODO
        const writer = res.transformStream.writable.getWriter();
        if (options.result.isDynamic()) {
            options.result.pipe({
                write: (chunk)=>writer.write(chunk)
                ,
                end: ()=>writer.close()
                ,
                destroy: (err)=>writer.abort(err)
                ,
                cork: ()=>{
                },
                uncork: ()=>{
                }
            });
        } else {
            res.body(await options.result.toUnchunkedString());
        }
        res.send();
    }
    async runApi() {
        // @TODO
        return true;
    }
    async findPageComponents(pathname, query, params) {
        const result = await this.webServerConfig.loadComponent(pathname);
        if (!result) return null;
        return {
            query: {
                ...query || {
                },
                ...params || {
                }
            },
            components: result
        };
    }
    updateRenderOpts(renderOpts) {
        Object.assign(this.renderOpts, renderOpts);
    }
}
exports.default = NextWebServer;

//# sourceMappingURL=web-server.js.map