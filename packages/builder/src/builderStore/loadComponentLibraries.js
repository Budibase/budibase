import { map } from "lodash/fp";

export const loadLibs = async (appName, appPackage) => {

    const makeUrl = l => 
        `/_builder/api/${appName}/componentlibrary?lib=${encodeURI(l)}`

    const allLibraries = {};
    for(let lib of appPackage.pages.componentLibraries) {
        const libModule = await import(makeUrl(lib));
        allLibraries[lib] = libModule;
    }

    return allLibraries;
}
