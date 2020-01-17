const { 
    appPackageFolder, 
    appsFolder 
} = require("../createAppPackage");
const { 
    readJSON, writeJSON, readdir,
    stat, ensureDir, rename,
    unlink, rmdir
} = require("fs-extra");
const { 
    join,dirname
} = require("path");
const { $ } = require("@budibase/core").common;
const { 
    keyBy, intersection, map
} = require("lodash/fp");
const {merge} = require("lodash");

const { componentLibraryInfo } = require("./componentLibraryInfo");
const savePackage = require("./savePackage");
const buildApp = require("./buildApp");

module.exports.savePackage = savePackage;

const getPages = async (appPath) => await readJSON(`${appPath}/pages.json`);
const getAppDefinition = async (appPath) => await readJSON(`${appPath}/appDefinition.json`);

module.exports.getPackageForBuilder = async (config, appname) => {
    const appPath = appPackageFolder(config, appname);

    const pages = await getPages(appPath);

    return ({
        appDefinition: await getAppDefinition(appPath),

        accessLevels: await readJSON(`${appPath}/access_levels.json`),

        pages,

        components: await getComponents(appPath, pages),

        screens: keyBy("name")(
            await fetchscreens(appPath))
    });

}



module.exports.getApps = async (config, master) => {
    const dirs = await readdir(appsFolder(config));

    return $(master.listApplications(), [
        map(a => a.name),
        intersection(dirs)
    ]);
}


const componentPath = (appPath, name) =>
    join(appPath, "components", name + ".json");

module.exports.saveScreen = async (config, appname, component) => {
    const appPath = appPackageFolder(config, appname);
    const compPath = componentPath(appPath, component.name);
    await ensureDir(dirname(compPath));
    await writeJSON(
        compPath, 
        component,
        {encoding:"utf8", flag:"w", spaces:2});
}

module.exports.renameScreen = async (config, appname, oldName, newName) => {
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

module.exports.deleteScreen = async (config, appname, name) => {
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


const getComponents = async (appPath, pages ,lib) => {

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
    const generators = {};

    for(let l of libs) {
        const info = await componentLibraryInfo(appPath, l);
        merge(components, info.components);
        merge(generators, info.generators);
    }

    if(components._lib) delete components._lib;
    if(components._generators) delete components._generators;
    
    return {components, generators};
}

const fetchscreens = async (appPath, relativePath = "") => {
    
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
            const childComponents = await fetchscreens(
                appPath, join(relativePath, item)
            );

            for(let c of childComponents) {
                components.push(c);
            }
        }
    }

    return components;
}

module.exports.getComponents = getComponents;