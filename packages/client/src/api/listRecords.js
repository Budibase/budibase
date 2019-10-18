import {trimSlash} from "../common/trimSlash";

export const listRecords = api => async ({indexKey, statePath}) => {
    if(!indexKey) {
        api.error("Load Record: record key not set");
        return;
    }  
    
    if(!statePath) {
        api.error("Load Record: state path not set");
        return;
    } 

    const records = await api.get({
        url:`/api/listRecords/${trimSlash(indexKey)}`
    });

    if(api.isSuccess(records))
        api.setState(statePath, records);
}