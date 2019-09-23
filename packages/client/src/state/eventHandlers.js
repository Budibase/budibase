import { setState } from "./setState";
import { getState } from "./getState";
import {
    isArray, isUndefined
} from "lodash/fp";

import { createApi } from "../api";
import {
    getNewChildRecordToState, getNewRecordToState
} from "./coreHandlers";

export const EVENT_TYPE_MEMBER_NAME = "##eventHandlerType";

export const eventHandlers = (store,coreApi) => {
    
    const handler = (parameters, execute) => ({
        execute, parameters
    });

    const api = createApi({
        rootPath:"",
        setState: (path, value) => setState(store, path, value),
        getState: (path, fallback) => getState(store, path, fallback)
    });

    const setStateHandler = ({path, value}) => setState(store, path, value);
    
    return {
        "Set State": handler(["path", "value"],  setStateHandler),
        "Load Record": handler(["recordKey", "statePath"], api.loadRecord),
        "List Records": handler(["indexKey", "statePath"], api.listRecords),
        "Save Record": handler(["statePath"], api.saveRecord),
        
        "Get New Child Record": handler(
            ["recordKey", "collectionName", "childRecordType", "statePath"], 
            getNewChildRecordToState(store, coreApi)),

        "Get New Record": handler(
            ["collectionKey", "childRecordType", "statePath"], 
            getNewRecordToState(store, coreApi)),
    };
};

export const isEventType = prop => 
    isArray(prop) 
    && prop.length > 0
    && !isUndefined(prop[0][EVENT_TYPE_MEMBER_NAME]);
