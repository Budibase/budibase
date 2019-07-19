import {
    isString, 
    isBoolean, 
    isNumber,
    isArray,
    isUndefined
} from "lodash/fp";

import { assign } from "lodash";

export const createDefaultProps = (propsDefinition, derivedFromProps) => {

    const props = {};
    const errors = [];

    for(let propDef in propsDefinition) {
        const parsedPropDef = parsePropDef(propsDefinition[propDef]);
        if(parsedPropDef.error)
            errors.push({propName:propDef, error:parsedPropDef.error});
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
    const error = message => ({error:message});

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

const propType = (defaultValue, isOfType) => ({
    isOfType, default:defaultValue
});

const types = {
    string: propType(() => "", isString),
    bool: propType(() => false, isBoolean),
    number: propType(() => 0, isNumber),
    array: propType(() => [], isArray)
}