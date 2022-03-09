"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../../../shared/lib/constants");
var _getRouteFromEntrypoint = _interopRequireDefault(require("../../../server/get-route-from-entrypoint"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class PagesManifestPlugin {
    constructor({ serverless , dev  }){
        this.serverless = serverless;
        this.dev = dev;
    }
    createAssets(compilation, assets) {
        const entrypoints = compilation.entrypoints;
        const pages = {
        };
        for (const entrypoint of entrypoints.values()){
            const pagePath = (0, _getRouteFromEntrypoint).default(entrypoint.name);
            if (!pagePath) {
                continue;
            }
            const files = entrypoint.getFiles().filter((file)=>!file.includes('webpack-runtime') && !file.includes('webpack-api-runtime') && file.endsWith('.js')
            );
            // Write filename, replace any backslashes in path (on windows) with forwardslashes for cross-platform consistency.
            pages[pagePath] = files[files.length - 1];
            if (!this.dev) {
                pages[pagePath] = pages[pagePath].slice(3);
            }
            pages[pagePath] = pages[pagePath].replace(/\\/g, '/');
        }
        assets[`${!this.dev ? '../' : ''}` + _constants.PAGES_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify(pages, null, 2));
    }
    apply(compiler) {
        compiler.hooks.make.tap('NextJsPagesManifest', (compilation)=>{
            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
            compilation.hooks.processAssets.tap({
                name: 'NextJsPagesManifest',
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                this.createAssets(compilation, assets);
            });
        });
    }
}
exports.default = PagesManifestPlugin;

//# sourceMappingURL=pages-manifest-plugin.js.map