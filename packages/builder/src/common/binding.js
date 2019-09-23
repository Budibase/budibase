import {
    isString
} from "lodash/fp";

export const BB_STATE_BINDINGPATH = "##bbstate";
export const BB_STATE_FALLBACK = "##bbstatefallback";

export const isBinding = value => 
    !isString(value) 
    && value
    && isString(value[BB_STATE_BINDINGPATH])
    && value[BB_STATE_BINDINGPATH].length > 0;

export const setBinding = ({path, fallback}, binding={} ) => {
    if(isNonEmptyString(path)) binding[BB_STATE_BINDINGPATH] = path;
    if(isNonEmptyString(fallback)) binding[BB_STATE_FALLBACK] = fallback;
    return binding
}

export const getBinding = binding => ({
    path: binding[BB_STATE_BINDINGPATH] || "",
    fallback: binding[BB_STATE_FALLBACK] || ""
});

const isNonEmptyString = s => isString(s) && s.length > 0;