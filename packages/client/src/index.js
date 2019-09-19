import { createApp } from "./createApp";

const appDefinition = window["##BUDIBASE_APPDEFINITION##"];

const componentLibraryUrl = (lib) =>  "./" + trimSlash(lib)

const trimSlash = (str) => str.replace(/^\/+|\/+$/g, '');

(async () => {
    
    const componentLibraries = {};

    for(let lib of appDefinition.componentLibraries) {
        componentLibraries[lib.libName] = await import(
            componentLibraryUrl(lib.importPath)); 
    }


    const _app = createApp(componentLibraries);

    _app.initialiseComponent(
        props,
        document.body);

})();