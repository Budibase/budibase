"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _webpack = require("next/dist/compiled/webpack/webpack");
var _constants = require("../../../shared/lib/constants");
const PLUGIN_NAME = 'FlightManifestPlugin';
class FlightManifestPlugin {
    constructor(options){
        this.dev = false;
        if (typeof options.dev === 'boolean') {
            this.dev = options.dev;
        }
        this.clientComponentsRegex = options.clientComponentsRegex;
        this.runtime = options.runtime;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory  })=>{
            compilation.dependencyFactories.set(_webpack.webpack.dependencies.ModuleDependency, normalModuleFactory);
            compilation.dependencyTemplates.set(_webpack.webpack.dependencies.ModuleDependency, new _webpack.webpack.dependencies.NullDependency.Template());
        });
        // Only for webpack 5
        compiler.hooks.make.tap(PLUGIN_NAME, (compilation)=>{
            compilation.hooks.processAssets.tap({
                name: PLUGIN_NAME,
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>this.createAsset(assets, compilation)
            );
        });
    }
    createAsset(assets, compilation) {
        const json = {
        };
        const { clientComponentsRegex  } = this;
        compilation.chunkGroups.forEach((chunkGroup)=>{
            function recordModule(id, _chunk, mod) {
                var ref;
                const resource = (ref = mod.resource) === null || ref === void 0 ? void 0 : ref.replace(/\?flight$/, '');
                // TODO: Hook into deps instead of the target module.
                // That way we know by the type of dep whether to include.
                // It also resolves conflicts when the same module is in multiple chunks.
                const isNextClientComponent = /next[\\/](link|image)/.test(resource);
                if (!clientComponentsRegex.test(resource) && !isNextClientComponent) {
                    return;
                }
                const moduleExports = json[resource] || {
                };
                const exportsInfo = compilation.moduleGraph.getExportsInfo(mod);
                const providedExports = exportsInfo.getProvidedExports();
                const moduleExportedKeys = [
                    '',
                    '*'
                ].concat(// TODO: improve exports detection
                providedExports === true || providedExports == null ? 'default' : providedExports);
                moduleExportedKeys.forEach((name)=>{
                    if (!moduleExports[name]) {
                        moduleExports[name] = {
                            id,
                            name,
                            chunks: []
                        };
                    }
                });
                json[resource] = moduleExports;
            }
            chunkGroup.chunks.forEach((chunk)=>{
                const chunkModules = compilation.chunkGraph.getChunkModulesIterable(chunk);
                for (const mod of chunkModules){
                    let modId = compilation.chunkGraph.getModuleId(mod);
                    // remove resource query on production
                    if (typeof modId === 'string') {
                        modId = modId.split('?')[0];
                    }
                    recordModule(modId, chunk, mod);
                    // If this is a concatenation, register each child to the parent ID.
                    if (mod.modules) {
                        mod.modules.forEach((concatenatedMod)=>{
                            recordModule(modId, chunk, concatenatedMod);
                        });
                    }
                }
            });
        });
        const output = (this.runtime === 'edge' ? 'self.__RSC_MANIFEST=' : '') + JSON.stringify(json);
        assets[`server/${_constants.MIDDLEWARE_FLIGHT_MANIFEST}${this.runtime === 'edge' ? '.js' : '.json'}`] = new _webpack.sources.RawSource(output);
    }
}
exports.FlightManifestPlugin = FlightManifestPlugin;

//# sourceMappingURL=flight-manifest-plugin.js.map