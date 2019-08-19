import { splitName } from "./splitRootComponentName";
import {
    find,
    filter
} from "lodash/fp";
import { isRootComponent } from "./searchComponents";

export const libraryDependencies = (allComponents, lib) => {

    const componentDependsOnLibrary = comp => {
        if(isRootComponent(comp)) {
            const {libName} = splitName(component.name);
            return (libName === lib);
        }
        return componentDependsOnLibrary(
            find(c => c.name === comp.inherits)(allComponents)
        );
    }

    return filter(c => !isRootComponent(c) 
                        && componentDependsOnLibrary(c))(
        allComponents
    );
}