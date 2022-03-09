"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
// Map of a feature module to the file it belongs in the next package.
const FEATURE_MODULE_MAP = new Map([
    [
        'next/image',
        '/next/image.js'
    ],
    [
        'next/script',
        '/next/script.js'
    ],
    [
        'next/dynamic',
        '/next/dynamic.js'
    ], 
]);
// List of build features used in webpack configuration
const BUILD_FEATURES = [
    'swcLoader',
    'swcMinify',
    'swcRelay',
    'swcStyledComponents',
    'swcReactRemoveProperties',
    'swcExperimentalDecorators',
    'swcRemoveConsole',
    'swcImportSource', 
];
class TelemetryPlugin {
    // Build feature usage is on/off and is known before the build starts
    constructor(buildFeaturesMap){
        this.usageTracker = new Map();
        for (const featureName of BUILD_FEATURES){
            this.usageTracker.set(featureName, {
                featureName,
                invocationCount: buildFeaturesMap.get(featureName) ? 1 : 0
            });
        }
        for (const featureName1 of FEATURE_MODULE_MAP.keys()){
            this.usageTracker.set(featureName1, {
                featureName: featureName1,
                invocationCount: 0
            });
        }
    }
    apply(compiler) {
        compiler.hooks.make.tapAsync(TelemetryPlugin.name, async (compilation, callback)=>{
            compilation.hooks.finishModules.tapAsync(TelemetryPlugin.name, async (modules, modulesFinish)=>{
                for (const module of modules){
                    const feature = findFeatureInModule(module);
                    if (!feature) {
                        continue;
                    }
                    const connections = compilation.moduleGraph.getIncomingConnections(module);
                    const originModules = findUniqueOriginModulesInConnections(connections);
                    this.usageTracker.get(feature).invocationCount = originModules.size;
                }
                modulesFinish();
            });
            callback();
        });
    }
    usages() {
        return [
            ...this.usageTracker.values()
        ];
    }
}
exports.TelemetryPlugin = TelemetryPlugin;
/**
 * Determine if there is a feature of interest in the specified 'module'.
 */ function findFeatureInModule(module) {
    if (module.type !== 'javascript/auto') {
        return;
    }
    for (const [feature, path] of FEATURE_MODULE_MAP){
        if (module.identifier().replace(/\\/g, '/').endsWith(path)) {
            return feature;
        }
    }
}
/**
 * Find unique origin modules in the specified 'connections', which possibly
 * contains more than one connection for a module due to different types of
 * dependency.
 */ function findUniqueOriginModulesInConnections(connections) {
    const originModules = new Set();
    for (const connection of connections){
        if (!originModules.has(connection.originModule)) {
            originModules.add(connection.originModule);
        }
    }
    return originModules;
}

//# sourceMappingURL=telemetry-plugin.js.map