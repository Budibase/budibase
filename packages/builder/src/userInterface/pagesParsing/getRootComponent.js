import { isRootComponent } from "./searchComponents";
import { find } from "lodash/fp";

export const getRootComponent = (componentName, allComponents) => {
    const component = find(c => c.name === componentName)(allComponents);

    if(isRootComponent(component)) return component;

    return getRootComponent(component.inherits, allComponents);
}