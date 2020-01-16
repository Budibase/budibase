import { getRecordInfo } from "../recordApi/recordInfo";
import { 
    getParentKey, getLastPartInKey
} from "../templateApi/hierarchy";
import { keySep } from "../common";

export const getIndexDir = (hierarchy, indexKey) => {

    const parentKey = getParentKey(indexKey);

    if(parentKey === "") return indexKey;
    if(parentKey === keySep) return indexKey;

    const recordInfo = getRecordInfo(
        hierarchy, 
        parentKey);
        
    return recordInfo.child(
        getLastPartInKey(indexKey));
}