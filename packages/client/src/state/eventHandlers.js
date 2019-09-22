import {
    setState
} from "./setState";
import {
    isArray, isUndefined
} from "lodash/fp";

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType";

export const eventHandlers = store => {
    
    const handler = (parameters, execute) => ({
        execute, parameters
    });

    const setStateHandler = ({path, value}) => setState(store, path, value);
    
    return {
        "Set State": handler(["path", "value"],  setStateHandler)
    };
};

export const isEventType = prop => 
    isArray(prop) 
    && prop.length > 0
    && !isUndefined(prop[0][EVENT_TYPE_MEMBER_NAME]);
