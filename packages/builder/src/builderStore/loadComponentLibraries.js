import { map } from "lodash/fp";

export const loadLibs = async (appName, appPackage) => {

    const allLibraries = {};
    for(let lib of appPackage.pages.componentLibraries) {
        const libModule = await import(makeLibraryUrl(appName, lib));
        allLibraries[lib] = libModule;
    }

    return allLibraries;
}

export const loadLib = async (appName, lib, allLibs) => {
    allLibs[lib] = await import(makeLibraryUrl(appName, lib));
    return allLibs;
}

export const makeLibraryUrl = (appName, lib) => 
    `/_builder/${appName}/componentlibrary?lib=${encodeURI(lib)}`