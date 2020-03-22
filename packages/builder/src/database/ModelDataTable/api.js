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
      recordBase = overwritePresentProperties(recordBase, record)
    }

    const SAVE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record/`
    const response = await api.post(SAVE_RECORDS_URL, recordBase)
    return await response.json()
  }

  export async function duplicateRecord(record, { appname, instanceId }) {
    let recordBase = { ...record }

    delete recordBase.id

    recordBase = getNewRecord(recordBase, recordBase.key)
    recordBase = overwritePresentProperties(recordBase, record)

    const SAVE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record/`
    const response = await api.post(SAVE_RECORDS_URL, recordBase)
    return await response.json()
  }

  export async function fetchDataForView(viewName, { appname, instanceId }) {
    const FETCH_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/listRecords/${viewName}`;

    const response = await api.get(FETCH_RECORDS_URL);
    return await response.json();

  }

  function overwritePresentProperties(baseObj, overwrites)  {
    const base = { ...baseObj }

    for (let key in base) {
      if (overwrites[key]) base[key] = overwrites[key]
    }
    return base;
  }