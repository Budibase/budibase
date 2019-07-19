import { types } from "./types";
import { createDefaultProps } from "./createDefaultProps";
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

export const validateProps = (propsDefinition, props, isFinal=true) => {

    const errors = [];

    for(let propDefName in propsDefinition) {

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
                    propDef.itemPropsDefinition,
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
    const { errors } = createDefaultProps(propsDefinition);
    

    // arrar props without itemPropsDefinition
    pipe(propsDefinition, [
        keys,
        map(k => ({
            propDef:propsDefinition[k],
            propName:k
        })),
        filter(d => d.propDef.type === "array" && !d.propDef.itemPropsDefinition),
        each(d => makeError(errors, d.propName)(`${d.propName} does not have a definition for it's item props`))
    ]);

    const arrayPropValidationErrors = pipe(propsDefinition, [
        keys,
        map(k => propsDefinition[k]),
        filter(d => d.type === "array" && d.itemPropsDefinition),
        map(d => validatePropsDefinition(d.itemPropsDefinition)),
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

