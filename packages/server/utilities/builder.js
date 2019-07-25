const { 
    appPackageFolder, 
    appsFolder 
} = require("./createAppPackage");
const { 
    writeFile, 
    readFile, 
    readdir,
    exists 
} = require("./fsawait");
const { resolve } = require("path");
const { $ } = require("budibase-core").common;
const { 
    keys,
    reduce,
    map,
    flatten,
    some 
} = require("lodash/fp");

module.exports.getPackageForBuilder = async (config, appname) => {
    const appPath = appPackageFolder(config, appname);
    return ({
        appDefinition: JSON.parse(await readFile(
            `${appPath}/appDefinition.json`, 
            "utf8")),

        accessLevels: JSON.parse(await readFile(
            `${appPath}/access_levels.json`,
            "utf8")),

        pages: JSON.parse(await readFile(
            `${appPath}/pages.json`,
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

    await writeFile(
        `${appPath}/pages.json`,
        JSON.stringify(pkg.accessLevels),
        "utf8");
}

module.exports.getApps = async (config) => 
    await readdir(appsFolder(config));


module.exports.getComponents = async (config, appname, lib) => {

    const componentsInLibrary = (libname) => {
        const isRelative = some(c => c === libname.substring(0,1))
                               ("./~\\".split(""));
        
        const componentsPath = isRelative
                           ? resolve(appPath, libname, "components.json")
                           : resolve(libname, "components.json");
        
        if(!await exists(componentsPath)) {
            const e = new Error(`could not find components definition file at ${componentsPath}`);
            e.statusCode = 404;
            throw e;
        }

        let components;
        try {
            components = JSON.parse(
                readFile(componentsPath, "utf8"));
        } catch(e) {
            const e = new Error(`could not parse JSON - ${componentsPath} `);
            throw e;
        }

        return $(components, [
            keys,
            reduce((obj, k) => {
                obj[`${libname}/${k}`] = components[k]
                return obj;
            }, {})
        ])
    }     

    let libs;
    if(!lib) {
        const appPath = appPackageFolder(config, appname);

        const pages = JSON.parse(await readFile(
            `${appPath}/pages.json`,
            "utf8"));

        if(!pages.componentLibraries) return [];

        libs = pages.componentLibraries;
    } else {
        libs = [lib];
    }

    return $(libs, [
        map(componentsInLibrary),
        flatten
    ]);
}

