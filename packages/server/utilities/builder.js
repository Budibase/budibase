const { 
    appPackageFolder, 
    appsFolder 
} = require("./createAppPackage");
const { 
    readJSON,
    writeJSON,
    readdir,
    exists,
    stat,
    ensureDir,
    rename,
    unlink,
    rmdir
} = require("fs-extra");
const { 
    resolve,
    join,
    dirname
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

module.exports.savePackage = async (config, appname, pkg) => {
    const appPath = appPackageFolder(config, appname);
    await writeJSON(
        `${appPath}/appDefinition.json`, 
        pkg.appDefinition);

    await writeJSON(
        `${appPath}/access_levels.json`,
        pkg.accessLevels);

    await writeJSON(
        `${appPath}/pages.json`,
        pkg.pages);
}

module.exports.getApps = async (config) => 
    await readdir(appsFolder(config));


const componentPath = (appPath, name) =>
    join(appPath, "components", name + ".json");

module.exports.saveDerivedComponent = async (config, appname, component) => {
    const appPath = appPackageFolder(config, appname);

    await writeJSON(
        componentPath(appPath, component.name), 
        component,
        {encoding:"utf8", flag:"w"});
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
            components = await readJSON(componentsPath);
        } catch(e) {
            const err = `could not parse JSON - ${componentsPath} : ${e.message}`;
            throw new Error(err);
        }

        return $(components, [
            keys,
            reduce((obj, k) => {
                const component = components[k];
                component.name = `${libname}/${k}`;
                obj[component.name] = component;
                return obj;
            }, {})
        ])
    }     

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

            const component = 
                await readJSON(itemFullPath);

            component.name = itemRelativePath
                                .substring(0, itemRelativePath.length - 5)
                                .replace(/\\/g, "/");

            component.props = component.props || {};
            component.props._component = component.name;

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