import {pipe}  from "../../common/core";

import {
    find,
    isUndefined,
    filter,
    some,
    includes
} from "lodash/fp";

const normalString = s => (s||"").trim().toLowerCase();

export const isRootComponent = c => isUndefined(c.inherits);

export const searchAllComponents = (allComponents, phrase) => {

    const hasPhrase = (...vals) => 
        pipe(vals, [
            some(v => includes(normalString(phrase))(normalString(v)))
        ]);

    const componentMatches = c => {
        if(hasPhrase(c.name, ...(c.tags || []))) return true;

        if(isRootComponent(c)) return false;
        
        const parent = getExactComponent(
            allComponents,
            c.inherits);

        return componentMatches(parent);
    }

    return filter(componentMatches)(allComponents);
} 

export const getExactComponent = (allComponents, name) => {
    
    const stringEquals = (s1, s2) => 
        normalString(s1) === normalString(s2);
    
    return pipe(allComponents,[
        find(c => stringEquals(c.name, name))
    ]);
}

export const getAncestorProps = (allComponents, name, found=[]) => {
    const thisComponent = getExactComponent(
        allComponents, name);

    if(isRootComponent(thisComponent)) 
        return [thisComponent.props, ...found];

    return getAncestorProps(
        allComponents, 
        thisComponent.inherits,
        [{...thisComponent.props}, 
        ...found]);

}
