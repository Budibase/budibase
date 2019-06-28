const { join } = require("path");
const constructHierarchy = require("./constructHierarchy");
const { common } = require("budibase-core");
const createAppPackage = (appPath) => ({
    appDefinition: require(join(appPath, "appDefinition.json")),
    behaviourSources: require(join(appPath, "plugins.js")),
    appPath
});

module.exports.masterAppPackage = (config) => {
    const standardPackage = createAppPackage("../appPackages/master");

    const customizeMaster = config && config.customizeMaster 
                            ? config.customizeMaster
                            : a => a;

    const appDefinition = common.$(standardPackage.appDefinition, [
        customizeMaster,
        constructHierarchy
    ]);

    const plugins = require("../appPackages/master/plugins.js")
                           (config);

    return ({
        appDefinition,
        behaviourSources: config && config.extraMasterPlugins
                          ? {...plugins, ...config.extraMasterPlugins}
                          : plugins,
        appPath: standardPackage.appPath
    });
}
    
module.exports.applictionVersionPackage = (appname, versionId) => {
    const pkg = createAppPackage(`../runtimePackages/${appname}/${versionId}`);
    pkg.appDefinition = constructHierarchy(appDefinition);
    return pkg;
}
