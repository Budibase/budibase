import { createApp } from "./createApp";


export const loadBudibase = async (componentLibraries, props) => {

    const appDefinition = window["##BUDIBASE_APPDEFINITION##"];

    if(!componentLibraries) {

        const componentLibraryUrl = (lib) =>  "./" + trimSlash(lib)
        const trimSlash = (str) => str.replace(/^\/+|\/+$/g, '');
        componentLibraries = {};

        for(let lib of appDefinition.componentLibraries) {
            componentLibraries[lib.libName] = await import(
                componentLibraryUrl(lib.importPath)); 
        }

    }

    if(!props) {
        props = appDefinition.props;
    }

    const _app = createApp(componentLibraries);
    _app.initialiseComponent(
        props,
        document.body);

};

window.loadBudibase = loadBudibase;