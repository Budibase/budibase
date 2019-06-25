const { join } = require("path");

const createAppPackage = (appPath) => ({
    appDefinition: require(join(appPath, "appDefinition.json")),
    behaviourSources: require(join(appPath, "plugins.json")),
    appPath
});

module.exports.masterAppPackage = (config) => {
    const standardPackage = createAppPackage("../appPackages/master");

    const customizeMaster = config && config.customizeMaster 
                            ? config.customizeMaster
                            : a => a;

    const appDefinition = customizeMaster(
        standardPackage.appDefinition);

    return ({
        appDefinition,
        behaviourSources: config && config.masterPlugins
                          ? config.masterPlugins 
                          : standardPackage.behaviourSources,
        appPath: standardPackage.appPath
    });
}
    
module.exports.applictionVersionPackage = (appname, versionId) => 
    createAppPackage(`../runtimePackages/${appname}/${versionId}`);


