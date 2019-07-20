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
    elementDefinition: typeName === "array" ? "string" : undefined
});

const propType = (defaultValue, isOfType, defaultDefinition) => ({
    isOfType, default:defaultValue, defaultDefinition
});

const isComponent = isObjectLike;

export const types = {
    string: propType(() => "", isString, defaultDef("string")),
    bool: propType(() => false, isBoolean, defaultDef("bool")),
    number: propType(() => 0, isNumber, defaultDef("number")),
    array: propType(() => [], isArray, defaultDef("array")),
    options: propType(() => "", isString, defaultDef("options")),
    component: propType(() => ({_component:""}), isComponent, defaultDef("component"))
};