import {
    isUndefined,
    isObject
} from "lodash/fp";

export const getState = (s, path, fallback) => {

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