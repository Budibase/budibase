const { DocumentTypes, SEPARATOR } = require("../db/utils")

exports.isExternalTable = tableId => {
  return tableId.includes(DocumentTypes.DATASOURCE)
}

exports.buildExternalTableId = (datasourceId, tableName) => {
  return `${datasourceId}${SEPARATOR}${tableName}`
}

exports.breakExternalTableId = tableId => {
  const parts = tableId.split(SEPARATOR)
  let tableName = parts.pop()
  let datasourceId = parts.join(SEPARATOR)
  return { datasourceId, tableName }
}
