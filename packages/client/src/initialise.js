import { writable } from "svelte/store";
import { initialiseComponent } from "./initialiseComponent";

export const initialise = async (document, appDefinition) => {
    
    const componentLibraries = {};

    for(let lib of appDefinition.componentLibraries) {
        componentLibraries[lib.libName] = await import(
            componentLibraryUrl(lib.importPath)); 
    }

    const store = writable({});

    initialiseComponent(componentLibraries, store)(
        appDefinition.props,
        document.body);
}
const componentLibraryUrl = (lib) =>  "./" + trimSlash(lib)

const trimSlash = (str) => str.replace(/^\/+|\/+$/g, '');

