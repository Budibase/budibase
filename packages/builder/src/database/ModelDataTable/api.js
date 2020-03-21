  import api from "../../builderStore/api";
  import { getNewRecord, getNewInstance } from "../../common/core"

  export async function createDatabase(appname, instanceName) {
    const CREATE_DATABASE_URL = `/_builder/instance/_master/0/api/record`
    const database = getNewInstance(appname, instanceName);
    const response = await api.post(CREATE_DATABASE_URL, database);
    return await response.json()
  }

  export async function deleteRecord(record, { appname, instanceId }) {
    const DELETE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record${record.key}`
    const response = await api.delete(DELETE_RECORDS_URL);
    return response;
  }

  export async function saveRecord(record, { appname, instanceId }) {
    let recordBase = { ...record }

    // brand new record
    if (record.collectionName) {
      const collectionKey = `/${record.collectionName}`
      recordBase = getNewRecord(recordBase, collectionKey)
      // overwrite the new record template values 
      for (let key in recordBase) {
        if (record[key]) recordBase[key] = record[key]
      }
    }

    const SAVE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record/`
    const response = await api.post(SAVE_RECORDS_URL, recordBase)
    return await response.json()
  }

  export async function fetchDataForView(viewName, { appname, instanceId }) {
    const FETCH_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/listRecords/${viewName}`;

    // TODO: Error handling
    const response = await api.get(FETCH_RECORDS_URL);
    return await response.json();

  }