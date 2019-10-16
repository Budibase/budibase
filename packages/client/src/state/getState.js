import {
    isUndefined,
    isObject
} from "lodash/fp";
import { 
    isBound,BB_STATE_BINDINGPATH, BB_STATE_FALLBACK, takeStateFromStore
} from "./isState";

export const getState = (s, path, fallback) => {

    if(!path || path.length === 0) return fallback;

    if(path === "$") return s;

    const pathParts = path.split(".");
    const safeGetPath = (obj, currentPartIndex=0) => {

        const currentKey = pathParts[currentPartIndex];

        if(pathParts.length - 1 == currentPartIndex) {
            const value = obj[currentKey];
            if(isUndefined(value))
                return fallback;
            else 
                return value;
        }

        if(obj[currentKey] === null 
          || obj[currentKey] === undefined
          || !isObject(obj[currentKey])) {

            return fallback;
        }

        return safeGetPath(obj[currentKey], currentPartIndex + 1);

    }


    return safeGetPath(s);
}

export const getStateOrValue = (globalState, prop, currentContext) => {
    if(!isBound(prop)) return prop;

    const stateToUse = takeStateFromStore(prop) 
                       ? globalState
                       : currentContext;

    return getState(stateToUse, prop[BB_STATE_BINDINGPATH], prop[BB_STATE_FALLBACK]);
}