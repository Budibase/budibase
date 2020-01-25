import { 
    setupBinding 
} from "../state/stateBinding";
import { 
    split,
    last
} from "lodash/fp";
import { $ } from "../core/common";

export const _initialiseChildren = ({ bb, coreApi, store, componentLibraries, appDefinition, parentContext, hydrate }) => 
                            (childrenProps, htmlElement, context, anchor=null) => {

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


        const componentProps = {
            ...initialProps, 
            _bb:bb(context || parentContext, childProps)
        };

        const component = new (componentLibraries[libName][componentName])({
            target: htmlElement,
            props: componentProps,
            hydrate:false,
            anchor
        });

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