export const listRecords = api => async ({indexKey, statePath}) => {
    if(!recordKey) {
        api.error("Load Record: record key not set");
        return;
    }  
    
    if(!statePath) {
        api.error("Load Record: state path not set");
        return;
    } 

    const records = get({
        url:`${rootPath}/api/listRecords/${indexKey}`
    });

    if(api.isSuccess(records))
        api.setState(statePath, records);
}