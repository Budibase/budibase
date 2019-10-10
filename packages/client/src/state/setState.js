import {
    isObject
} from "lodash/fp";
import { BB_STATE_BINDINGPATH } from "./isState";

export const setState = (store, path, value) => {

    if(!path || path.length === 0) return;

    const pathParts = path.split(".");
    const safeSetPath = (obj, currentPartIndex=0) => {

        const currentKey = pathParts[currentPartIndex];

        if(pathParts.length - 1 == currentPartIndex) {
            obj[currentKey] = value;
            return;
        }

        if(obj[currentKey] === null 
          || obj[currentKey] === undefined
          || !isObject(obj.currentKey)) {

            obj[currentKey] = {};
        }

        safeSetPath(obj[currentKey], currentPartIndex + 1);

    }

    store.update(s => {
        safeSetPath(s);
        return s;
    });
};

export const setStateFromBinding = (store, binding, value) => 
    setState(store, binding[BB_STATE_BINDINGPATH], value);