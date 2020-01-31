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
        store, componentLibraries, treeNode,
        appDefinition, document, hydrate } = initialiseOpts;

    for(let childNode of treeNode.children) {
        if(childNode.unsubscribe)
            childNode.unsubscribe();
        if(childNode.component)
            childNode.component.$destroy();
    }

    if(hydrate) {
        while (htmlElement.firstChild) {
            htmlElement.removeChild(htmlElement.firstChild);
        }
    }

    const renderedComponents = [];
    for(let childProps of childrenProps) {       
        
        const {componentName, libName} = splitName(childProps._component);

        if(!componentName || !libName) return;
        
        const {initialProps, bind} = setupBinding(
                store, childProps, coreApi,  
                appDefinition.appRootPath);
       
        const componentConstructor = componentLibraries[libName][componentName];

        const renderedComponentsThisIteration = renderComponent({
            props: childProps,
            parentNode: treeNode,
            componentConstructor,uiFunctions, 
            htmlElement, anchor, initialProps, 
            bb});
        
        for(let comp of renderedComponentsThisIteration) {
            comp.unsubscribe = bind(comp.component);
            renderedComponents.push(comp);
        }   
    }

    return renderedComponents;
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
