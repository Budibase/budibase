const { 
    appPackageFolder, 
    appsFolder 
} = require("./createAppPackage");
const { 
    writeFile, 
    readFile, 
    readdir,
    exists,
    stat 
} = require("./fsawait");
const { 
    resolve,
    join
} = require("path");
const { $ } = require("budibase-core").common;
const { 
    keys,
    reduce,
    some,
    keyBy
} = require("lodash/fp");
const {merge} = require("lodash");

module.exports.getPackageForBuilder = async (config, appname) => {
    const appPath = appPackageFolder(config, appname);

    const pages = JSON.parse(await readFile(
        `${appPath}/pages.json`,
        "utf8"));

    return ({
        appDefinition: JSON.parse(await readFile(
            `${appPath}/appDefinition.json`, 
            "utf8")),

        accessLevels: JSON.parse(await readFile(
            `${appPath}/access_levels.json`,
            "utf8")),

        pages,

        rootComponents: await getRootComponents(appPath, pages),

        derivedComponents: keyBy("_name")(
            await fetchDerivedComponents(appPath))
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
        JSON.stringify(pkg.pages),
        "utf8");
}

module.exports.getApps = async (config) => 
    await readdir(appsFolder(config));


const getRootComponents = async (appPath, pages ,lib) => {

    const componentsInLibrary = async (libname) => {
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
                await readFile(componentsPath, "utf8"));
        } catch(e) {
            const err = `could not parse JSON - ${componentsPath} : ${e.message}`;
            throw new Error(err);
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
        pages = pages || JSON.parse(await readFile(
            `${appPath}/pages.json`,
            "utf8"));

        if(!pages.componentLibraries) return [];

        libs = pages.componentLibraries;
    } else {
        libs = [lib];
    }

    const components = {};
    for(let l of libs) {
        merge(components, await componentsInLibrary(l))
    }

    return components;
}

const fetchDerivedComponents = async (appPath, relativePath = "") => {
    
    const currentDir = join(appPath, "components", relativePath);

    const contents = await readdir(currentDir);

    const components = [];

    for(let item of contents) {
        const itemRelativePath = join(relativePath, item);
        const itemFullPath = join(currentDir, item);
        const stats = await stat(itemFullPath);

        if(stats.isFile()) {
            
            if(!item.endsWith(".json")) continue;

            const component = JSON.parse(
                await readFile(itemFullPath, "utf8"));

            component._name = itemRelativePath
                                .substring(0, itemRelativePath.length - 5)
                                .replace(/\\/g, "/");

            components.push(component);
        } else {
            const childComponents = await fetchDerivedComponents(
                appPath, join(relativePath, item)
            );

            for(let c of childComponents) {
                components.push(c);
            }
        }
    }

    return components;
}

module.exports.getRootComponents = getRootComponents;