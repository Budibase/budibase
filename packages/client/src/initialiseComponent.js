import { 
    find,
    isUndefined,
    split,
    last
} from "lodash/fp";

import { $ } from "./core/common";

export const initialiseComponent = (allComponents, componentLibraries, store) => (props, htmlElement) => {

    const rootComponent = getRootComponent(
        props._component, allComponents);

    const _app = {
        initialiseComponent: initialiseComponent(allComponents, componentLibraries, store), 
        store
    };

    const {componentName, libName} = splitName(
       rootComponent.name);

    new (componentLibraries[libName][componentName])({
        target: htmlElement,
        props: {...props, _app}
    });

}

const getRootComponent = (componentName, allComponents) => {
    const component = find(c => c.name === componentName)(allComponents);

    if(isRootComponent(component)) return component;

    return getRootComponent(component.inherits, allComponents);
}

const isRootComponent = c => isUndefined(c.inherits);


const splitName = fullname => {
    const componentName = $(fullname, [
        split("/"),
        last
    ]);

    const libName =fullname.substring(
        0, fullname.length - componentName.length - 1);

    return {libName, componentName}; 
}