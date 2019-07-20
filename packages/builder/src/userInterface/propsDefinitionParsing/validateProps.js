import { types } from "./types";
import { createProps } from "./createProps";
import { isString } from "util";
import { 
    includes,
    filter, 
    map, 
    keys, 
    flatten,
    each } from "lodash/fp";
import { common } from "budibase-core";

const pipe = common.$;

const makeError = (errors, propName) => (message) =>
    errors.push({
        propName, 
        error:message});

export const recursivelyValidate = (rootProps, getComponentPropsDefinition, stack=[]) => {

    const propsDef = getComponentPropsDefinition(
        rootProps._component);

    const errors = validateProps(
        propsDef,
        rootProps);

    // adding name to object.... for ease
    const childErrors = pipe(propsDef, [
        keys,
        map(k => ({...propsDef[k], name:k })),
        filter(d => d.type === "component"),
        map(d => ({
            errs:recursivelyValidate(
                rootProps[d.name], 
                d.def, 
                [...stack, propsDef]),
            def:d
        }))
    ]);
}

export const validateProps = (propsDefinition, props, isFinal=true) => {

    const errors = [];

    if(!props._component) 
        makeError(errors, "_component")("Component is not set");

    for(let propDefName in propsDefinition) {
        
        if(propDefName === "_component") continue;

        let propDef = propsDefinition[propDefName];

        if(isString(propDef))
            propDef = types[propDef].defaultDefinition();

        const type = types[propDef.type];

        const error = makeError(errors, propDefName);            

        const propValue = props[propDefName];
        if(isFinal && propDef.required && propValue) {
            error(`Property ${propDefName} is required`);
            continue;
        } 

        if(!type.isOfType(propValue)) {
            error(`Property ${propDefName} is not of type ${propDef.type}. Actual value ${propValue}`)
            continue;
        }

        if(propDef.type === "array") {
            for(let arrayItem of propValue) {
                const arrayErrs = validateProps(
                    propDef.elementDefinition,
                    arrayItem,
                    isFinal
                )
                for(let arrErr of arrayErrs) {
                    errors.push(arrErr);
                }
            }    
        }

        if(propDef.type === "options" 
           && propValue
           && !includes(propValue)(propDef.options)) {
            error(`Property ${propDefName} is not one of allowed options. Acutal value is ${propValue}`);
        }

    }

    return errors;
}

export const validatePropsDefinition = (propsDefinition) => {
    const { errors } = createProps("dummy_component_name", propsDefinition);
    

    // arrar props without elementDefinition
    pipe(propsDefinition, [
        keys,
        map(k => ({
            propDef:propsDefinition[k],
            propName:k
        })),
        filter(d => d.propDef.type === "array" && !d.propDef.elementDefinition),
        each(d => makeError(errors, d.propName)(`${d.propName} does not have a definition for it's item props`))
    ]);

    const arrayPropValidationErrors = pipe(propsDefinition, [
        keys,
        map(k => propsDefinition[k]),
        filter(d => d.type === "array" && d.elementDefinition),
        map(d => validatePropsDefinition(d.elementDefinition)),
        flatten
    ]);

    pipe(propsDefinition, [
        keys,
        map(k => ({
            propDef:propsDefinition[k],
            propName:k
        })),
        filter(d => d.propDef.type === "options"
                    && (!d.propDef.options || d.propDef.options.length === 0)),
        each(d => makeError(errors, d.propName)(`${d.propName} does not have any options`))
    ]);

    return [...errors, ...arrayPropValidationErrors] 

}

