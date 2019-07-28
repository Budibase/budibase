import {
    find,
    isUndefined,
    filter,
    some,
    includes
} from "lodash/fp";

import {
    common
} from "budibase-core";


const pipe = common.$;

const normalString = s => (s||"").trim().toLowerCase();

const isRootComponent = c => isUndefined(c.inherits);

export const searchAllComponents = (derivedComponents, rootComponents, phrase) => {

    const hasPhrase = (...vals) => 
        pipe(vals, [
            some(v => includes(normalString(phrase))(normalString(v)))
        ]);

    const rootComponentMatches = c => 
        hasPhrase(c.name, ...(c.tags || []));

    const derivedComponentMatches = c => {
        if(hasPhrase(c.name, ...(c.tags || []))) return true;
        
        const parent = getExactComponent(
            derivedComponents,
            rootComponents,
            c.inherits);

        if(isRootComponent(parent)) 
            return rootComponentMatches(parent);

        return derivedComponentMatches(parent);
    }

    return ([
        ...filter(derivedComponentMatches)(derivedComponents),
        ...filter(rootComponentMatches)(rootComponents)
    ]);
    
} 

export const getExactComponent = (derivedComponents, rootComponents, name) => {
    
    const stringEquals = (s1, s2) => 
        normalString(s1) === normalString(s2);
    
    const derived = pipe(derivedComponents,[
        find(c => stringEquals(c.name, name))
    ]);

    if(derived) return derived;

    const root = pipe(rootComponents,[
        find(c => stringEquals(c.name, name))
    ]);

    return root;
}

export const getAncestorProps = (derivedComponents, rootComponents, name, found=[]) => {
    const thisComponent = getExactComponent(
        derivedComponents, rootComponents, name);

    if(isRootComponent(thisComponent)) 
        return [thisComponent.props, ...found];

    return getAncestorProps(
        derivedComponents, 
        rootComponents, 
        thisComponent.inherits,
        [{_component:thisComponent.inherits, ...thisComponent.props}, 
        ...found]);

}