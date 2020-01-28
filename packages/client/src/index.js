import { createApp } from "./createApp";
import { trimSlash } from "./common/trimSlash";

export const loadBudibase = async ({
    componentLibraries, props, 
    window, localStorage, uiFunctions }) => {

    const appDefinition = window["##BUDIBASE_APPDEFINITION##"];

    const userFromStorage = localStorage.getItem("budibase:user")

    const user = userFromStorage ? JSON.parse(userFromStorage) : {
        name: "annonymous",
        permissions : [],
        isUser:false,
        temp:false
    };

    if(!componentLibraries) {

        const rootPath = appDefinition.appRootPath === "" 
                         ? "" 
                         : "/" + trimSlash(appDefinition.appRootPath);
        const componentLibraryUrl = (lib) =>  rootPath + "/" + trimSlash(lib)
        componentLibraries = {};

        for(let lib of appDefinition.componentLibraries) {
            componentLibraries[lib.libName] = await import(
                componentLibraryUrl(lib.importPath)); 
        }

    }

    if(!props) {
        props = appDefinition.props;
    }

    const _app = createApp(
        componentLibraries, 
        appDefinition,  
        user, 
        uiFunctions || {});
    app.hydrateChildren(
        [props],
        window.document.body);

    return app;
};

if(window) {
    window.loadBudibase = loadBudibase;
}