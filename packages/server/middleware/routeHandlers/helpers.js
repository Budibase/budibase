exports.getRecordKey = (appname, wholePath) =>
  wholePath
    .replace(`/${appname}/api/files/`, "")
    .replace(`/${appname}/api/lookup_field/`, "")
    .replace(`/${appname}/api/record/`, "")
    .replace(`/${appname}/api/listRecords/`, "")
    .replace(`/${appname}/api/aggregates/`, "")
