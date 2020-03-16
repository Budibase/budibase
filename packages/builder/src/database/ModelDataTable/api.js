  import api from "../../builderStore/api";
  import { getNewRecord } from "../../common/core"

  export async function deleteRecord(record, { appname, instanceId }) {
    const DELETE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record/${record.name}/${record.id}`
    const response = await api.delete({
      url: DELETE_RECORDS_URL
    });
    return response;
  }

  export async function saveRecord(record, { appname, instanceId }) {
    const SAVE_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/record`
    const updatedRecord = getNewRecord(record, "")
    const response = await api.post(SAVE_RECORDS_URL, updatedRecord)
    return response
  }

  export async function fetchDataForView(viewName, { appname, instanceId }) {
    const FETCH_RECORDS_URL = `/_builder/instance/${appname}/${instanceId}/api/listRecords/${viewName}`;

    // TODO: Error handling
    const response = await api.get(FETCH_RECORDS_URL);
    return await response.json();

  }