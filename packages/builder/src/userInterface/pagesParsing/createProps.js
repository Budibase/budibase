import {
    isString, 
    isUndefined,
    find,
    keys,
    uniq,
    some,
    keyBy
} from "lodash/fp";
import { types } from "./types";
import { assign } from "lodash";
import { pipe } from "../../common/core";
import { isRootComponent } from "./searchComponents";

export const createPropDefinitionForDerived = (allComponents, componentName) => {
    const traverseForProps = (cname, derivedProps=[]) => {
        const component = find(c => c.name === cname)(allComponents);
        if(isRootComponent(component)) return ({propDef:component.props, derivedProps});
        return traverseForProps(component.inherits, [component.props, ...derivedProps]);
    }

    const {propDef, derivedProps} = traverseForProps(componentName);

    const hasDerivedProp = k => pipe(derivedProps, [
        keys,
        uniq,
        some(key => key === k)
    ]);

    return pipe(propDef, [
        keys,
        filter(k => !hasDerivedProp(k)),
        reduce((obj, k) => {
            obj[k] = propDef[k]
        }, {})
    ])
}

export const createProps = (componentName, propsDefinition, derivedFromProps) => {

    const error = (propName, error) =>
        errors.push({propName, error});

    const props = {
        _component: componentName
    };

    const errors = [];

    if(!componentName)
        error("_component", "Component name not supplied");

    for(let propDef in propsDefinition) {
        const parsedPropDef = parsePropDef(propsDefinition[propDef]);
        if(parsedPropDef.error)
            error(propDef, parsedPropDef.error); 
        else 
            props[propDef] = parsedPropDef;
    }

    if(derivedFromProps) {
        assign(props, ...derivedFromProps);
    }

    return ({
        props, errors
    });
}

const parsePropDef = propDef => {
    const error = message => ({error:message, propDef});

    if(isString(propDef)) {
        if(!types[propDef])
            return error(`Do not recognise type ${propDef}`);
        
        return types[propDef].default();
    }

    if(!propDef.type)
        return error("Property Definition must declare a type");
    
    const type = types[propDef.type];
    if(!type)
        return error(`Do not recognise type ${propDef.type}`);

    if(isUndefined(propDef.default))
        return type.default(propDef);

    if(!type.isOfType(propDef.default))
        return error(`${propDef.default} is not of type ${type}`);

    return propDef.default;
}

/*
Allowed propDefOptions
- type: string, bool, number, array
- default: default value, when undefined
- required: field is required 
*/