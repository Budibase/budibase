import { writable } from "svelte/store";
import { initialiseComponent } from "./initialiseComponent";

export const initialise = async (document, appDefinition, pageDefinition) => {
    for(let stylesheet of pageDefinition.stylesheets) {
        addStylesheet(document, stylesheet);
    }

    const componentLibraries = {};

    for(let lib of appDefinition.componentLibraries) {
        componentLibraries[lib] = await import(
            componentLibraryUrl(lib, appDefinition.appRootPath)); 
    }

    const store = writable({});

    initialiseComponent(allComponents, componentLibraries, store)(
        appDefinition.rootProps,
        document.body);
}
const componentLibraryUrl = (lib, rootUrlPath) =>
    `${rootPath}/api/componentlibrary?lib=${encodeURI(lib)}`

const addStylesheet = (document, url) => {

    const head = document.head;
    const link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
  
    head.appendChild(link);
  }