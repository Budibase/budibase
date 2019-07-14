const { appPackageFolder, appsFolder } = require("./createAppPackage");
const { writeFile, readFile, readdir } = require("./fsawait");
const { pipe : $ } = require("budibase-core").common; 

module.exports.getPackageForBuilder = async (config, appname) => {
    const appPath = appPackageFolder(config, appname);
    return ({
        appDefinition: JSON.parse(await readFile(
            `${appPath}/appDefinition.json`, 
            "utf8")),

        accessLevels: JSON.parse(await readFile(
            `${appPath}/access_levels.json`,
            "utf8"))
    })

}


module.exports.savePackage = async (config, appname, pkg) => {
    const appPath = appPackageFolder(config, appname);
    await writeFile(
        `${appPath}/appDefinition.json`, 
        JSON.stringify(pkg.appDefinition),
        "utf8");

    await writeFile(
        `${appPath}/access_levels.json`,
        JSON.stringify(pkg.accessLevels),
        "utf8");

}

module.exports.getApps = async (config) => 
    await readdir(appsFolder(config));



