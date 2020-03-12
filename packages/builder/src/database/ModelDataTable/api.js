  import api from "../../builderStore/api";

  export async function deleteRecord(appName, appInstanceId, record) {
    const DELETE_RECORDS_URL = `/_builder/instance/${appName}/${appInstanceId}/api/record/${record.name}/${record.id}`
    const response = await api.delete({
      url: DELETE_RECORDS_URL
    });
  }

  export async function createNewRecord(record) {
    console.log(record);
  }

  export async function fetchDataForView(viewName) {
    console.log(viewName);
    // const FETCH_RECORDS_URL = `/_builder/instance/${}/${}/api/listRecords/`

    // const response = await api.get({ url: FETCH_RECORDS_URL });

    // console.log(response);

    // GET /_builder/instance/:appname/:instanceid/api/listRecords/contacts/abcd1234/all_deals

  }