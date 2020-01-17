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

    if(!rootProps._component) {
        const errs = [];
        makeError(errs, "_component", stack)("Component is not set");
        return errs;
        // this would break everything else anyway
    }

    const componentDef = getComponent(
        rootProps._component);


    const errors = validateProps(
        componentDef,
        rootProps,
        stack,
        true);

    const validateChildren = (_props, _stack) => 
        !_props._children 
        ? [] 
        : pipe(_props._children, [
            map(child => recursivelyValidate(
                            child, 
                            getComponent, 
                            [..._stack, _props._children.indexOf(child)]))
         ]);

    const childErrors = validateChildren(
                            rootProps, stack);

    return flattenDeep([errors, ...childErrors]);
}

const expandPropDef = propDef => 
    isString(propDef)
    ? types[propDef].defaultDefinition()
    : propDef;



export const validateProps = (componentDefinition, props, stack=[], isFinal=true) => {

    const errors = [];

    if(isFinal && !props._component) {
        makeError(errors, "_component", stack)("Component is not set");
        return errors;
        // this would break everything else anyway
    }

    const propsDefinition = componentDefinition.props;

    for(let propDefName in props) {
        
        if(propDefName === "_component") continue;
        if(propDefName === "_children") continue;
        if(propDefName === "_layout") continue;

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
            if(propDef.type === "event") {
                error(`Cannot apply binding to type ${propDef.type}`);
                continue;
            }
        }
        else if(!type.isOfType(propValue)) {
            error(`Property ${propDefName} is not of type ${propDef.type}. Actual value ${propValue}`)
            continue;
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

export const validateComponentDefinition = (componentDefinition) => {
    const { errors } = createProps(componentDefinition);
    
    const propDefinitions = expandPropDef(componentDefinition.props);

    pipe(propDefinitions, [
        keys,
        map(k => ({
            propDef:propDefinitions[k],
            propName:k
        })),
        filter(d => d.propDef.type === "options"
                    && (!d.propDef.options || d.propDef.options.length === 0)),
        each(d => makeError(errors, d.propName)(`${d.propName} does not have any options`))
    ]);

    return errors;

}

