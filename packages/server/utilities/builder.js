const { appPackageFolder } = require("./createAppPackage");
const { writeFile, readFile } = require("./fsawait");

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