

 export const loadRecord = (api) => async ({recordKey, statePath}) => {

    if(!recordKey) {
        api.error("Load Record: record key not set");
        return;
    }  
    
    if(!statePath) {
        api.error("Load Record: state path not set");
        return;
    } 

    const record = await get({
        url:`${rootPath}/api/record/${key}`
    });

    if(api.isSuccess(record))
        api.setState(statePath, record);
}