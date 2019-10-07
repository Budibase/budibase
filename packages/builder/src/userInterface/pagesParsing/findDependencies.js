import { splitName } from "./splitRootComponentName";
import {
    find, filter, cloneDeep, isPlainObject,
    isArray
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

export const componentDependencies = (pages, allComponents, dependsOn) => {

    
    pages = cloneDeep(pages);
    allComponents = cloneDeep(allComponents);
    const dependantComponents = [];
    const dependantPages = [];

    const traverseProps = (props) => {
     
        if(props._component && props._component === dependsOn.name) {
            return true;
        } 

        for(let propName in props) {
            const prop = props[propName];
            if(isPlainObject(prop) && prop._component) {
                if(traverseProps(prop)) return true;
            }
            if(isArray(prop)) {
                for(let element of prop) {
                    if(traverseProps(element)) return true;
                }
            }
        }

        return false;
    }


    for(let component of allComponents) {
        
        if(isRootComponent(component)) {
            continue;
        }

        if(component.name === dependsOn.name) {
            continue;
        }

        if(component.inherits === dependsOn.name) {
            dependantComponents.push(component);
            continue;
        }
        
        if(traverseProps(component.props)) {
            dependantComponents.push(component);
        }

    }

    for(let pageName in pages) {
        const page = pages[pageName];
        if(page.appBody === dependsOn.name) {
            dependantPages.push(pageName);
        }
    }

    return {dependantComponents, dependantPages};

}