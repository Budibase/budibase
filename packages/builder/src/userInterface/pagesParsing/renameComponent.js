import { 
    isPlainObject, isArray, cloneDeep
} from "lodash/fp";
import {
    isRootComponent, getExactComponent
} from "./searchComponents";

export const rename = (pages, allComponents, oldname, newname) => {

    pages = cloneDeep(pages);
    allComponents = cloneDeep(allComponents);
    const changedComponents = [];

    const existingWithNewName = getExactComponent(allComponents, newname);
    if(existingWithNewName) return {
        allComponents, pages, error: "Component by that name already exists"
    };

    const traverseProps = (props) => {
        let hasEdited = false;
        if(props._component && props._component === oldname) {
            props._component = newname;
            hasEdited = true;
        } 

        for(let propName in props) {
            const prop = props[propName];
            if(isPlainObject(prop) && prop._component) {
                hasEdited = traverseProps(prop) || hasEdited;
            }
            if(isArray(prop)) {
                for(let element of prop) {
                    hasEdited = traverseProps(element) || hasEdited;
                }
            }
        }
        return hasEdited;
    }


    for(let component of allComponents) {
        
        if(isRootComponent(component)) {
            continue;
        }

        let hasEdited = false;

        if(component.name === oldname) {
            component.name = newname;
            hasEdited = true;
        }

        if(component.inherits === oldname) {
            component.inherits = newname;
            hasEdited = true;
        }
        
        hasEdited = traverseProps(component.props) || hasEdited;

        if(hasEdited && component.name !== newname)
            changedComponents.push(component.name);
    }

    for(let pageName in pages) {
        const page = pages[pageName];
        if(page.appBody === oldname) {
            page.appBody = newname;
        }
    }

    return {allComponents, pages, changedComponents};


}