import { ERROR } from "./standardState";

export const getNewChildRecordToState = (store, coreApi, setState) =>
            ({recordKey, collectionName,childRecordType,statePath}) => {
    const error = errorHandler(setState);
    try {
        if(!recordKey) {
            error("getNewChild > recordKey not set");
            return;
        }

        if(!collectionName) {
            error("getNewChild > collectionName not set");
            return;
        }

        if(!childRecordType) {
            error("getNewChild > childRecordType not set");
            return;
        }

        if(!statePath) {
            error("getNewChild > statePath not set");
            return;
        }

        const rec = coreApi.recordApi.getNewChild(recordKey, collectionName, childRecordType);
        setState(store, statePath, rec);
    }
    catch(e) {
        error(e.message);
    }
}


export const getNewRecordToState = (store, coreApi, setState) =>
            ({collectionKey,childRecordType,statePath}) => {
    const error = errorHandler(setState);
    try {
        if(!collectionKey) {
            error("getNewChild > collectionKey not set");
            return;
        }

        if(!childRecordType) {
            error("getNewChild > childRecordType not set");
            return;
        }

        if(!statePath) {
            error("getNewChild > statePath not set");
            return;
        }

        const rec = coreApi.recordApi.getNew(collectionKey, childRecordType);
        setState(store, statePath, rec);
    }
    catch(e) {
        error(e.message);
    }
}

const errorHandler = setState => message => setState(ERROR, message);