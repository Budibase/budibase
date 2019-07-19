import {
    isString, 
    isBoolean, 
    isNumber,
    isArray
} from "lodash/fp";

const defaultDef = typeName => () => ({
    type: typeName,
    required:false,
    default:types[typeName].default,
    options: typeName === "options" ? [] : undefined,
    itemPropsDefinition: typeName === "array" ? "string" : undefined
});

const propType = (defaultValue, isOfType, defaultDefinition) => ({
    isOfType, default:defaultValue, defaultDefinition
});

export const types = {
    string: propType(() => "", isString, defaultDef("string")),
    bool: propType(() => false, isBoolean, defaultDef("bool")),
    number: propType(() => 0, isNumber, defaultDef("number")),
    array: propType(() => [], isArray, defaultDef("array")),
    options: propType(() => "", isString, defaultDef("options"))
};