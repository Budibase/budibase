const { join } = require("path");
const constructHierarchy = require("./constructHierarchy");
const { common } = require("budibase-core");
const { getRuntimePackageDirectory } = require("../utilities/runtimePackages");
const createAppPackage = (config, appPath) => {

    const appDefModule = require(
        join(appPath, "appDefinition.json"));

    const pluginsModule = require(
        join(appPath, "plugins.js"));
        
    return ({
        appDefinition: appDefModule,
        behaviourSources: pluginsModule(config),
        appPath
    })
}

module.exports.masterAppPackage = (config) => {
    const standardPackage = createAppPackage(config, "../appPackages/master");

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
    
module.exports.applictionVersionPackage = (config, appname, versionId) => {
    const pkg = createAppPackage(
        config,
        join("..", getRuntimePackageDirectory(appname, versionId))
    );
    pkg.appDefinition = constructHierarchy(pkg.appDefinition);
    return pkg;
}
