import { 
    setupBinding 
} from "../state/stateBinding";
import { 
    split,
    last
} from "lodash/fp";
import { $ } from "../core/common";
import { renderComponent } from "./renderComponent";

export const _initialiseChildren = (initialiseOpts) => 
                            (childrenProps, htmlElement, anchor=null) => {

    const { uiFunctions, bb, coreApi, 
        store, componentLibraries, 
        appDefinition, parentContext, hydrate } = initialiseOpts;
        
    const childComponents = [];

    if(hydrate) {
        while (htmlElement.firstChild) {
            htmlElement.removeChild(htmlElement.firstChild);
        }
    }
    
    for(let childProps of childrenProps) {       
        
        const {componentName, libName} = splitName(childProps._component);

        if(!componentName || !libName) return;
        
        const {initialProps, bind} = setupBinding(
                store, childProps, coreApi,  
                appDefinition.appRootPath);

       
        const componentConstructor = componentLibraries[libName][componentName];

        const {component, context} = renderComponent({
            componentConstructor,uiFunctions, 
            htmlElement, anchor, 
            parentContext, initialProps, bb});


        bind(component);
        childComponents.push({component, context});
    }

    return childComponents;
}

const splitName = fullname => {
    const componentName = $(fullname, [
        split("/"),
        last
    ]);

    const libName =fullname.substring(
        0, fullname.length - componentName.length - 1);

    return {libName, componentName}; 
}