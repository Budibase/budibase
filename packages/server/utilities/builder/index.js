const { 
    appPackageFolder, 
    appsFolder 
} = require("../createAppPackage");
const { 
    readJSON,
    writeJSON,
    readdir,
    stat,
    ensureDir,
    rename,
    unlink,
    rmdir
} = require("fs-extra");
const { 
    join,
    dirname
} = require("path");
const { $ } = require("budibase-core").common;
const { 
    keyBy
} = require("lodash/fp");
const {merge} = require("lodash");

const { componentLibraryInfo } = require("./componentLibraryInfo");
const savePackage = require("./savePackage");

module.exports.savePackage = savePackage;

module.exports.getPackageForBuilder = async (config, appname) => {
    const appPath = appPackageFolder(config, appname);

    const pages = await readJSON(`${appPath}/pages.json`);

    return ({
        appDefinition: await readJSON(`${appPath}/appDefinition.json`),

        accessLevels: await readJSON(`${appPath}/access_levels.json`),

        pages,

        rootComponents: await getRootComponents(appPath, pages),

        derivedComponents: keyBy("name")(
            await fetchDerivedComponents(appPath))
    })

}



module.exports.getApps = async (config) => 
    await readdir(appsFolder(config));


const componentPath = (appPath, name) =>
    join(appPath, "components", name + ".json");

module.exports.saveDerivedComponent = async (config, appname, component) => {
    const appPath = appPackageFolder(config, appname);
    const compPath = componentPath(appPath, component.name);
    await ensureDir(dirname(compPath));
    await writeJSON(
        compPath, 
        component,
        {encoding:"utf8", flag:"w", spaces:2});
}

module.exports.renameDerivedComponent = async (config, appname, oldName, newName) => {
    const appPath = appPackageFolder(config, appname);

    const oldComponentPath = componentPath(
        appPath, oldName);

    const newComponentPath = componentPath(
        appPath, newName);

    await ensureDir(dirname(newComponentPath));
    await rename(
        oldComponentPath, 
        newComponentPath);    
}

module.exports.deleteDerivedComponent = async (config, appname, name) => {
    const appPath = appPackageFolder(config, appname);
    const componentFile = componentPath(appPath, name);
    await unlink(componentFile);

    const dir = dirname(componentFile);
    if((await readdir(dir)).length === 0) {
        await rmdir(dir);
    }
}

module.exports.componentLibraryInfo = async (config, appname, lib) => {
    const appPath = appPackageFolder(config, appname);
    return await componentLibraryInfo(appPath, lib);
};


const getRootComponents = async (appPath, pages ,lib) => {

    let libs;
    if(!lib) {
        pages = pages || await readJSON(
            `${appPath}/pages.json`);

        if(!pages.componentLibraries) return [];

        libs = pages.componentLibraries;
    } else {
        libs = [lib];
    }

    const components = {};
    for(let l of libs) {
        const info = await componentLibraryInfo(appPath, l);
        merge(components, info.components);
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

            const component = 
                await readJSON(itemFullPath);

            component.name = itemRelativePath
                                .substring(0, itemRelativePath.length - 5)
                                .replace(/\\/g, "/");

            component.props = component.props || {};

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