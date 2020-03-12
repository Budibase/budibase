exports.getRecordKey = (appname, wholePath) =>
  this.getAppRelativePath(appname, wholePath)
    .replace(`/api/files/`, "/")
    .replace(`/api/lookup_field/`, "/")
    .replace(`/api/record/`, "/")
    .replace(`/api/listRecords/`, "/")
    .replace(`/api/aggregates/`, "/")

exports.getAppRelativePath = (appname, wholePath) => {
  const builderInstanceRegex = new RegExp(
    `\\/_builder\\/instance\\/[^\\/]*\\/[^\\/]*\\/`
  )

  return wholePath.replace(builderInstanceRegex, "/").replace(`/${appname}`, "")
}
