import { createApp } from "./createApp";
import { trimSlash } from "./common/trimSlash";

export const loadBudibase = async (componentLibraries, props) => {

    const appDefinition = window["##BUDIBASE_APPDEFINITION##"];
    const user = localStorage.getItem("budibase:user") || {
        name: "annonymous",
        permissions : [],
        isUser:false,
        temp:false
    }

    if(!componentLibraries) {

        const componentLibraryUrl = (lib) =>  "./" + trimSlash(lib)
        componentLibraries = {};

        for(let lib of appDefinition.componentLibraries) {
            componentLibraries[lib.libName] = await import(
                componentLibraryUrl(lib.importPath)); 
        }

    }

    if(!props) {
        props = appDefinition.props;
    }

    const _app = createApp(componentLibraries, appDefinition,  user);
    _app.initialiseComponent(
        props,
        document.body);

};

window.loadBudibase = loadBudibase;