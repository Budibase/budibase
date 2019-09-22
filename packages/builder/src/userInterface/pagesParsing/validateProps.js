import { types } from "./types";
import { 
    createProps, arrayElementComponentName 
} from "./createProps";
import { isString } from "util";
import { 
    includes, filter, map, keys, 
    flatten, flattenDeep, each,
    indexOf, isUndefined
} from "lodash/fp";
import { common } from "../../../../core/src";
import {
    isBinding
} from "../../common/binding";

const pipe = common.$;

const makeError = (errors, propName, stack) => (message) =>
    errors.push({
        stack,
        propName, 
        error:message});

export const recursivelyValidate = (rootProps, getComponent, stack=[]) => {

    const getComponentPropsDefinition = componentName => {
        if(componentName.includes(":")) {
            const [parentComponent, arrayProp] = componentName.split(":");
            return getComponent(parentComponent)[arrayProp].elementDefinition;
        }
        return getComponent(componentName);
    }

    if(!rootProps._component) {
        const errs = [];
        makeError(errs, "_component", stack)("Component is not set");
        return errs;
        // this would break everything else anyway
    }

    const propsDef = getComponentPropsDefinition(
        rootProps._component);

    const getPropsDefArray = (def) => pipe(def, [
        keys,
        map(k => def[k].name 
                 ? expandPropDef(def[k])
                 : ({
                     ...expandPropDef(def[k]), 
                     name:k }))
    ]);

    const propsDefArray = getPropsDefArray(propsDef);

    const errors = validateProps(
        propsDef,
        rootProps,
        stack,
        true);

    const validateChildren = (_defArray, _props, _stack) => pipe(_defArray, [
        filter(d => d.type === "component"),
        map(d => recursivelyValidate(
                    _props[d.name], 
                    getComponentPropsDefinition, 
                    [..._stack, d.name])),
        flatten
    ]);

    const childErrors = validateChildren(
        propsDefArray, rootProps, stack);

    const childArrayErrors = pipe(propsDefArray, [
        filter(d => d.type === "array"),
        map(d => pipe(rootProps[d.name], [ 
                    map(elementProps => pipe(elementProps._component, [
                                            getComponentPropsDefinition,
                                            getPropsDefArray,
                                            arr => validateChildren(
                                                        arr, 
                                                        elementProps,
                                                        [...stack, 
                                                        `${d.name}[${indexOf(elementProps)(rootProps[d.name])}]`]) 
                    ])) 
                ]))
    ]);

    return flattenDeep([errors, ...childErrors, ...childArrayErrors]);
}

const expandPropDef = propDef => {
    const p = isString(propDef)
              ? types[propDef].defaultDefinition()
              : propDef;
    if(p.type === "array" && isString(p.elementDefinition)) {
        p.elementDefinition = types[p.elementDefinition].defaultDefinition()
    }
    return p;
}


export const validateProps = (propsDefinition, props, stack=[], isFinal=true) => {

    const errors = [];

    if(isFinal && !props._component) {
        makeError(errors, "_component", stack)("Component is not set");
        return errors;
        // this would break everything else anyway
    }

    for(let propDefName in propsDefinition) {
        
        if(propDefName === "_component") continue;

        const propDef = expandPropDef(propsDefinition[propDefName]);

        const type = types[propDef.type];

        const error = makeError(errors, propDefName, stack);            

        const propValue = props[propDefName];

        // component declarations dont need to define al props.
        if(!isFinal && isUndefined(propValue)) continue;

        if(isFinal && propDef.required && propValue) {
            error(`Property ${propDefName} is required`);
            continue;
        } 

        if(isBinding(propValue)) {
            if(propDef.type === "array" 
                || propDef.type === "component"
                || propDef.type === "event") {
                error(`Cannot apply binding to type ${propDef.type}`);
                continue;
            }
        }
        else if(!type.isOfType(propValue)) {
            error(`Property ${propDefName} is not of type ${propDef.type}. Actual value ${propValue}`)
            continue;
        }

        if(propDef.type === "array") {
            let index = 0;
            for(let arrayItem of propValue) {
                const arrayErrs = validateProps(
                    propDef.elementDefinition,
                    arrayItem,
                    [...stack, `${propDefName}[${index}]`],
                    isFinal
                )
                for(let arrErr of arrayErrs) {
                    errors.push(arrErr);
                }
                index++;
            }    
        }

        if(propDef.type === "options" 
           && propValue
           && !isBinding(propValue)
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

