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

exports.generateRowIdField = (keyProps = []) => {
  if (!Array.isArray(keyProps)) {
    keyProps = [keyProps]
  }
  // this conserves order and types
  return encodeURIComponent(JSON.stringify(keyProps))
}

// should always return an array
exports.breakRowIdField = _id => {
  if (!_id) {
    return null
  }
  return JSON.parse(decodeURIComponent(_id))
}
