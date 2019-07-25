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
    default:types[typeName].default,
    options: typeName === "options" ? [] : undefined,
    elementDefinition: typeName === "array" ? {} : undefined
});

const propType = (defaultValue, isOfType, defaultDefinition) => ({
    isOfType, default:defaultValue, defaultDefinition
});

/*export const expandPropDef = propDef => {
    const p = isString(propDef)
              ? types[propDef].defaultDefinition()
              : propDef;
    
    if(!isString(propDef)) {
        const def = types[propDef.type].defaultDefinition();
        assign(propDef, def);
    }

    if(p.type === "array" && isString(p.elementDefinition)) {
        p.elementDefinition = types[p.elementDefinition].defaultDefinition()
    }
    return p;
}*/

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