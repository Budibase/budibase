import {
    isString, 
    isBoolean, 
    isNumber,
    isArray,
    isObjectLike,
    isPlainObject,
    every
} from "lodash/fp";

import {
    EVENT_TYPE_MEMBER_NAME
} from "../../common/eventHandlers";

import {
    isBound, BB_STATE_BINDINGPATH
} from "@budibase/client/src/state/isState";

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
const isEvent = e => 
    isPlainObject(e) 
    && isString(e[EVENT_TYPE_MEMBER_NAME])
    && isPlainObject(e.parameters);

const isEventList = e => 
    isArray(e) && every(isEvent)(e);

const emptyState = () => {
    const s = {};
    s[BB_STATE_BINDINGPATH] = "";
    return s;
}

export const types = {
    string: propType(() => "", isString, defaultDef("string")),
    bool: propType(() => false, isBoolean, defaultDef("bool")),
    number: propType(() => 0, isNumber, defaultDef("number")),
    array: propType(() => [], isArray, defaultDef("array")),
    options: propType(() => "", isString, defaultDef("options")),
    component: propType(() => ({_component:""}), isComponent, defaultDef("component")),
    asset: propType(() => "", isString, defaultDef("asset")),
    event: propType(() => [], isEventList, defaultDef("event")),
    state: propType(() => emptyState(), isBound, defaultDef("state"))
};