const CouchDB = require("../../../db")
const linkRows = require("../../../db/linkedRows")
const csvParser = require("../../../utilities/csvParser")
const {
  getRowParams,
  generateRowID,
  InternalTables,
} = require("../../../db/utils")
const { isEqual } = require("lodash/fp")
const { AutoFieldSubTypes, FieldTypes } = require("../../../constants")
const { inputProcessing } = require("../../../utilities/rowProcessor")
const { USERS_TABLE_SCHEMA } = require("../../../constants")

exports.checkForColumnUpdates = async (db, oldTable, updatedTable) => {
  let updatedRows = []
  const rename = updatedTable._rename
  let deletedColumns = []
  if (oldTable && oldTable.schema && updatedTable.schema) {
    deletedColumns = Object.keys(oldTable.schema).filter(
      colName => updatedTable.schema[colName] == null
    )
  }
  // check for renaming of columns or deleted columns
  if (rename || deletedColumns.length !== 0) {
    const rows = await db.allDocs(
      getRowParams(updatedTable._id, null, {
        include_docs: true,
      })
    )
    updatedRows = rows.rows.map(({ doc }) => {
      if (rename) {
        doc[rename.updated] = doc[rename.old]
        delete doc[rename.old]
      } else if (deletedColumns.length !== 0) {
        deletedColumns.forEach(colName => delete doc[colName])
      }
      return doc
    })
    delete updatedTable._rename
  }
  return { rows: updatedRows, table: updatedTable }
}

// makes sure the passed in table isn't going to reset the auto ID
exports.makeSureTableUpToDate = (table, tableToSave) => {
  if (!table) {
    return tableToSave
  }
  // sure sure rev is up to date
  tableToSave._rev = table._rev
  // make sure auto IDs are always updated - these are internal
  // so the client may not know they have changed
  for (let [field, column] of Object.entries(table.schema)) {
    if (
      column.autocolumn &&
      column.subtype === AutoFieldSubTypes.AUTO_ID &&
      tableToSave.schema[field]
    ) {
      tableToSave.schema[field].lastID = column.lastID
    }
  }
  return tableToSave
}

exports.handleDataImport = async (appId, user, table, dataImport) => {
  const db = new CouchDB(appId)
  if (dataImport && dataImport.csvString) {
    // Populate the table with rows imported from CSV in a bulk update
    const data = await csvParser.transform(dataImport)

    for (let i = 0; i < data.length; i++) {
      let row = data[i]
      row._id = generateRowID(table._id)
      row.tableId = table._id
      const processed = inputProcessing(user, table, row)
      table = processed.table
      row = processed.row

      // make sure link rows are up to date
      row = await linkRows.updateLinks({
        appId,
        eventType: linkRows.EventType.ROW_SAVE,
        row,
        tableId: row.tableId,
        table,
      })

      for (let [fieldName, schema] of Object.entries(table.schema)) {
        // check whether the options need to be updated for inclusion as part of the data import
        if (
          schema.type === FieldTypes.OPTIONS &&
          (!schema.constraints.inclusion ||
            schema.constraints.inclusion.indexOf(row[fieldName]) === -1)
        ) {
          schema.constraints.inclusion = [
            ...schema.constraints.inclusion,
            row[fieldName],
          ]
        }
      }
      data[i] = row
    }

    await db.bulkDocs(data)
    let response = await db.put(table)
    table._rev = response._rev
  }
  return table
}

exports.handleSearchIndexes = async (appId, table) => {
  const db = new CouchDB(appId)
  // create relevant search indexes
  if (table.indexes && table.indexes.length > 0) {
    const currentIndexes = await db.getIndexes()
    const indexName = `search:${table._id}`

    const existingIndex = currentIndexes.indexes.find(
      existing => existing.name === indexName
    )

    if (existingIndex) {
      const currentFields = existingIndex.def.fields.map(
        field => Object.keys(field)[0]
      )

      // if index fields have changed, delete the original index
      if (!isEqual(currentFields, table.indexes)) {
        await db.deleteIndex(existingIndex)
        // create/recreate the index with fields
        await db.createIndex({
          index: {
            fields: table.indexes,
            name: indexName,
            ddoc: "search_ddoc",
            type: "json",
          },
        })
      }
    } else {
      // create/recreate the index with fields
      await db.createIndex({
        index: {
          fields: table.indexes,
          name: indexName,
          ddoc: "search_ddoc",
          type: "json",
        },
      })
    }
  }
  return table
}

exports.checkStaticTables = table => {
  // check user schema has all required elements
  if (table._id === InternalTables.USER_METADATA) {
    for (let [key, schema] of Object.entries(USERS_TABLE_SCHEMA.schema)) {
      // check if the schema exists on the table to be created/updated
      if (table.schema[key] == null) {
        table.schema[key] = schema
      }
    }
  }
  return table
}

class TableSaveFunctions {
  constructor({ db, ctx, oldTable, dataImport }) {
    this.db = db
    this.ctx = ctx
    if (this.ctx && this.ctx.user) {
      this.appId = this.ctx.appId
    }
    this.oldTable = oldTable
    this.dataImport = dataImport
    // any rows that need updated
    this.rows = []
  }

  // before anything is done
  async before(table) {
    if (this.oldTable) {
      table = exports.makeSureTableUpToDate(this.oldTable, table)
    }
    table = exports.checkStaticTables(table)
    return table
  }

  // when confirmed valid
  async mid(table) {
    let response = await exports.checkForColumnUpdates(
      this.db,
      this.oldTable,
      table
    )
    this.rows = this.rows.concat(response.rows)
    return table
  }

  // after saving
  async after(table) {
    table = await exports.handleSearchIndexes(this.appId, table)
    table = await exports.handleDataImport(
      this.appId,
      this.ctx.user,
      table,
      this.dataImport
    )
    return table
  }

  getUpdatedRows() {
    return this.rows
  }
}

exports.getAllExternalTables = async (appId, datasourceId) => {
  const db = new CouchDB(appId)
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return datasource.entities
}

exports.getExternalTable = async (appId, datasourceId, tableName) => {
  const entities = await exports.getAllExternalTables(appId, datasourceId)
  return entities[tableName]
}

exports.TableSaveFunctions = TableSaveFunctions
