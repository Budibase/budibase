const { join } = require("path");

const runtimePackagesDirectory = "./runtime_apps";

const getRuntimeAppsDirectory = (appName) => 
    join(runtimePackagesDirectory, appName);

module.exports.runtimePackagesDirectory = runtimePackagesDirectory;

module.exports.getRuntimePackageDirectory = (appName, versionId) => 
    join(
        getRuntimeAppsDirectory(appName), 
        versionId);

module.exports.getRuntimeAppsDirectory = getRuntimeAppsDirectory;
