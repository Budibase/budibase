const { join } = require("path");

const runtimePackagesDirectory = "./runtime_apps";

module.exports.runtimePackagesDirectory = runtimePackagesDirectory;

module.exports.getRuntimePackageDirectory = (appName, versionId) => 
    join(runtimePackagesDirectory, appName, versionId);
