import { 
    find,
    isUndefined,
    split,
    last
} from "lodash/fp";

import { $ } from "./core/common";

export const initialiseComponent = (componentLibraries, store) => (props, htmlElement) => {

    const _app = {
        initialiseComponent: initialiseComponent(componentLibraries, store), 
        store
    };

    const {componentName, libName} = splitName(props._component);

    new (componentLibraries[libName][componentName])({
        target: htmlElement,
        props: {...props, _app}
    });

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