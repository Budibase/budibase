import {trimSlash} from "../common/trimSlash";

 export const saveRecord = (api) => async ({statePath}) => {
    
    if(!statePath) {
        api.error("Load Record: state path not set");
        return;
    } 

    const recordtoSave = api.getState(statePath);

    if(!recordtoSave) {
        api.error(`there is no record in state: ${statePath}`);
        return;
    }

    if(!recordtoSave.key) {
        api.error(`item in state does not appear to be a record - it has no key (${statePath})`);
        return;
    }

    const savedRecord = await api.post({
        url:`/api/record/${trimSlash(recordtoSave.key)}`,
        body: recordtoSave
    });

    if(api.isSuccess(record))
        api.setState(statePath, savedRecord);
}