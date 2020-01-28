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
                            (childrenProps, htmlElement, context, anchor=null) => {

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
                context || parentContext, appDefinition.appRootPath);

        /// here needs to go inside renderComponent ???
        const componentProps = {
            ...initialProps, 
            _bb:bb(context || parentContext, childProps)
        };

        const componentConstructor = componentLibraries[libName][componentName];

        const {component} = renderComponent({
            componentConstructor,uiFunctions, 
            htmlElement, anchor, 
            parentContext, componentProps});


        bind(component);
        childComponents.push(component);
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