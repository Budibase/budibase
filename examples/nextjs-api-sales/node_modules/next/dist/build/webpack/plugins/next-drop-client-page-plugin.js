"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ampFirstEntryNamesMap = void 0;
var _constants = require("../../../shared/lib/constants");
const ampFirstEntryNamesMap = new WeakMap();
exports.ampFirstEntryNamesMap = ampFirstEntryNamesMap;
const PLUGIN_NAME = 'DropAmpFirstPagesPlugin';
class DropClientPage {
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory  })=>{
            // Recursively look up the issuer till it ends up at the root
            function findEntryModule(mod) {
                const queue = new Set([
                    mod
                ]);
                for (const module of queue){
                    // @ts-ignore TODO: webpack 5 types
                    const incomingConnections = compilation.moduleGraph.getIncomingConnections(module);
                    for (const incomingConnection of incomingConnections){
                        if (!incomingConnection.originModule) return module;
                        queue.add(incomingConnection.originModule);
                    }
                }
                return null;
            }
            function handler(parser) {
                function markAsAmpFirst() {
                    const entryModule = findEntryModule(parser.state.module);
                    if (!entryModule) {
                        return;
                    }
                    // @ts-ignore buildInfo exists on Module
                    entryModule.buildInfo.NEXT_ampFirst = true;
                }
                parser.hooks.preDeclarator.tap(PLUGIN_NAME, (declarator)=>{
                    var ref;
                    if ((declarator === null || declarator === void 0 ? void 0 : (ref = declarator.id) === null || ref === void 0 ? void 0 : ref.name) === _constants.STRING_LITERAL_DROP_BUNDLE) {
                        markAsAmpFirst();
                    }
                });
            }
            normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, handler);
            normalModuleFactory.hooks.parser.for('javascript/esm').tap(PLUGIN_NAME, handler);
            normalModuleFactory.hooks.parser.for('javascript/dynamic').tap(PLUGIN_NAME, handler);
            if (!ampFirstEntryNamesMap.has(compilation)) {
                ampFirstEntryNamesMap.set(compilation, []);
            }
            const ampFirstEntryNamesItem = ampFirstEntryNamesMap.get(compilation);
            compilation.hooks.seal.tap(PLUGIN_NAME, ()=>{
                for (const [name, entryData] of compilation.entries){
                    for (const dependency of entryData.dependencies){
                        var ref;
                        // @ts-ignore TODO: webpack 5 types
                        const module = compilation.moduleGraph.getModule(dependency);
                        if (module === null || module === void 0 ? void 0 : (ref = module.buildInfo) === null || ref === void 0 ? void 0 : ref.NEXT_ampFirst) {
                            ampFirstEntryNamesItem.push(name);
                            // @ts-ignore @types/webpack has outdated types for webpack 5
                            compilation.entries.delete(name);
                        }
                    }
                }
            });
        });
    }
    constructor(){
        this.ampPages = new Set();
    }
}
exports.DropClientPage = DropClientPage;

//# sourceMappingURL=next-drop-client-page-plugin.js.map