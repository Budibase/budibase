import { writable } from "svelte/store";
import { initialiseComponent } from "./initialiseComponent";

export const initialise = async (document, appDefinition) => {
    
    const componentLibraries = {};

    for(let lib of appDefinition.componentLibraries) {
        componentLibraries[lib] = await import(
            componentLibraryUrl(lib, appDefinition.appRootPath)); 
    }

    const store = writable({});

    initialiseComponent(allComponents, componentLibraries, store)(
        appDefinition.props,
        document.body);
}
const componentLibraryUrl = (lib, appRootPath) =>
    `${appRootPath}/componentlibrary?lib=${encodeURI(lib)}`

