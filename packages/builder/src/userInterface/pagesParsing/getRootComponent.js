import { isRootComponent } from "./searchComponents";
import { find } from "lodash/fp";

export const getRootComponent = (componentName, components) => {
    const component = find(c => c.name === componentName)(components);

    if(isRootComponent(component)) return component;

    return getRootComponent(component.props._component, components);
}