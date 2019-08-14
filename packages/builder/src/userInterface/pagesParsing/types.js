import {
    isString, 
    isBoolean, 
    isNumber,
    isArray,
    isObjectLike
} from "lodash/fp";

const defaultDef = typeName => () => ({
    type: typeName,
    required:false,
    default:types[typeName].default(),
    options: typeName === "options" ? [] : undefined,
    elementDefinition: typeName === "array" ? {} : undefined
});

const propType = (defaultValue, isOfType, defaultDefinition) => ({
    isOfType, default:defaultValue, defaultDefinition
});

const expandSingleProp = propDef => {
    const p = isString(propDef)
              ? types[propDef].defaultDefinition()
              : propDef;
    
    if(!isString(propDef)) {
        const def = types[propDef.type].defaultDefinition();
        for(let p in def) {
            if(propDef[p] === undefined) {
                propDef[p] = def[p];
            }
        }
    }

    if(p.type === "array") {
        p.elementDefinition = expandPropsDefinition(p.elementDefinition);
    }
    return p;
}

export const expandPropsDefinition = propsDefinition => {
    const expandedProps = {};
    for(let p in propsDefinition) {
        expandedProps[p] = expandSingleProp(propsDefinition[p]);
    }
    return expandedProps;
}

const isComponent = isObjectLike;

export const types = {
    string: propType(() => "", isString, defaultDef("string")),
    bool: propType(() => false, isBoolean, defaultDef("bool")),
    number: propType(() => 0, isNumber, defaultDef("number")),
    array: propType(() => [], isArray, defaultDef("array")),
    options: propType(() => "", isString, defaultDef("options")),
    component: propType(() => ({_component:""}), isComponent, defaultDef("component")),
    asset: propType(() => "", isString, defaultDef("asset")),
};