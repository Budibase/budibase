const { DocumentTypes, SEPARATOR } = require("../db/utils")

const DOUBLE_SEPARATOR = `${SEPARATOR}${SEPARATOR}`

exports.isExternalTable = tableId => {
  return tableId.includes(DocumentTypes.DATASOURCE)
}

exports.buildExternalTableId = (datasourceId, tableName) => {
  return `${datasourceId}${DOUBLE_SEPARATOR}${tableName}`
}

exports.breakExternalTableId = tableId => {
  const parts = tableId.split(DOUBLE_SEPARATOR)
  let tableName = parts.pop()
  let datasourceId = parts.join(DOUBLE_SEPARATOR)
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
