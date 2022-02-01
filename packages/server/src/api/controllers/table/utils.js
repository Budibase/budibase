const csvParser = require("../../../utilities/csvParser")
const {
  getRowParams,
  generateRowID,
  InternalTables,
  getTableParams,
  BudibaseInternalDB,
} = require("../../../db/utils")
const { isEqual } = require("lodash")
const { AutoFieldSubTypes, FieldTypes } = require("../../../constants")
const {
  inputProcessing,
  cleanupAttachments,
} = require("../../../utilities/rowProcessor")
const {
  USERS_TABLE_SCHEMA,
  SwitchableTypes,
  CanSwitchTypes,
} = require("../../../constants")
const {
  isExternalTable,
  breakExternalTableId,
  isSQL,
} = require("../../../integrations/utils")
const { getViews, saveView } = require("../view/utils")
const viewTemplate = require("../view/viewBuilder")
const usageQuota = require("../../../utilities/usageQuota")
const { getAppDB } = require("@budibase/backend-core/context")
const { cloneDeep } = require("lodash/fp")

exports.clearColumns = async (table, columnNames) => {
  const db = getAppDB()
  const rows = await db.allDocs(
    getRowParams(table._id, null, {
      include_docs: true,
    })
  )
  return db.bulkDocs(
    rows.rows.map(({ doc }) => {
      columnNames.forEach(colName => delete doc[colName])
      return doc
    })
  )
}

exports.checkForColumnUpdates = async (oldTable, updatedTable) => {
  const db = getAppDB()
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
    // Update all rows
    const rows = await db.allDocs(
      getRowParams(updatedTable._id, null, {
        include_docs: true,
      })
    )
    const rawRows = rows.rows.map(({ doc }) => doc)
    updatedRows = rawRows.map(row => {
      row = cloneDeep(row)
      if (rename) {
        row[rename.updated] = row[rename.old]
        delete row[rename.old]
      } else if (deletedColumns.length !== 0) {
        deletedColumns.forEach(colName => delete row[colName])
      }
      return row
    })

    // cleanup any attachments from object storage for deleted attachment columns
    await cleanupAttachments(updatedTable, { oldTable, rows: rawRows })
    // Update views
    await exports.checkForViewUpdates(updatedTable, rename, deletedColumns)
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

exports.handleDataImport = async (user, table, dataImport) => {
  if (!dataImport || !dataImport.csvString) {
    return table
  }

  const db = getAppDB()
  // Populate the table with rows imported from CSV in a bulk update
  const data = await csvParser.transform({
    ...dataImport,
    existingTable: table,
  })

  let finalData = []
  for (let i = 0; i < data.length; i++) {
    let row = data[i]
    row._id = generateRowID(table._id)
    row.tableId = table._id
    const processed = inputProcessing(user, table, row, {
      noAutoRelationships: true,
    })
    table = processed.table
    row = processed.row

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

    finalData.push(row)
  }

  await usageQuota.update(usageQuota.Properties.ROW, finalData.length, {
    dryRun: true,
  })
  await db.bulkDocs(finalData)
  await usageQuota.update(usageQuota.Properties.ROW, finalData.length)
  let response = await db.put(table)
  table._rev = response._rev
  return table
}

exports.handleSearchIndexes = async table => {
  const db = getAppDB()
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
  constructor({ user, oldTable, dataImport }) {
    this.db = getAppDB()
    this.user = user
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
    let response = await exports.checkForColumnUpdates(this.oldTable, table)
    this.rows = this.rows.concat(response.rows)
    return table
  }

  // after saving
  async after(table) {
    table = await exports.handleSearchIndexes(table)
    table = await exports.handleDataImport(this.user, table, this.dataImport)
    return table
  }

  getUpdatedRows() {
    return this.rows
  }
}

exports.getAllInternalTables = async () => {
  const db = getAppDB()
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return internalTables.rows.map(tableDoc => ({
    ...tableDoc.doc,
    type: "internal",
    sourceId: BudibaseInternalDB._id,
  }))
}

exports.getAllExternalTables = async datasourceId => {
  const db = getAppDB()
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return datasource.entities
}

exports.getExternalTable = async (datasourceId, tableName) => {
  const entities = await exports.getAllExternalTables(datasourceId)
  return entities[tableName]
}

exports.getTable = async tableId => {
  const db = getAppDB()
  if (isExternalTable(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await db.get(datasourceId)
    const table = await exports.getExternalTable(datasourceId, tableName)
    return { ...table, sql: isSQL(datasource) }
  } else {
    return db.get(tableId)
  }
}

exports.checkForViewUpdates = async (table, rename, deletedColumns) => {
  const views = await getViews()
  const tableViews = views.filter(view => view.meta.tableId === table._id)

  // Check each table view to see if impacted by this table action
  for (let view of tableViews) {
    let needsUpdated = false

    // First check for renames, otherwise check for deletions
    if (rename) {
      // Update calculation field if required
      if (view.meta.field === rename.old) {
        view.meta.field = rename.updated
        needsUpdated = true
      }

      // Update group by field if required
      if (view.meta.groupBy === rename.old) {
        view.meta.groupBy = rename.updated
        needsUpdated = true
      }

      // Update filters if required
      if (view.meta.filters) {
        view.meta.filters.forEach(filter => {
          if (filter.key === rename.old) {
            filter.key = rename.updated
            needsUpdated = true
          }
        })
      }
    } else if (deletedColumns) {
      deletedColumns.forEach(column => {
        // Remove calculation statement if required
        if (view.meta.field === column) {
          delete view.meta.field
          delete view.meta.calculation
          delete view.meta.groupBy
          needsUpdated = true
        }

        // Remove group by field if required
        if (view.meta.groupBy === column) {
          delete view.meta.groupBy
          needsUpdated = true
        }

        // Remove filters referencing deleted field if required
        if (view.meta.filters && view.meta.filters.length) {
          const initialLength = view.meta.filters.length
          view.meta.filters = view.meta.filters.filter(filter => {
            return filter.key !== column
          })
          if (initialLength !== view.meta.filters.length) {
            needsUpdated = true
          }
        }
      })
    }

    // Update view if required
    if (needsUpdated) {
      const newViewTemplate = viewTemplate(view.meta)
      await saveView(null, view.name, newViewTemplate)
      if (!newViewTemplate.meta.schema) {
        newViewTemplate.meta.schema = table.schema
      }
      table.views[view.name] = newViewTemplate.meta
    }
  }
}

exports.generateForeignKey = (column, relatedTable) => {
  return `fk_${relatedTable.name}_${column.fieldName}`
}

exports.generateJunctionTableName = (column, table, relatedTable) => {
  return `jt_${table.name}_${relatedTable.name}_${column.name}_${column.fieldName}`
}

exports.foreignKeyStructure = (keyName, meta = null) => {
  const structure = {
    type: FieldTypes.NUMBER,
    constraints: {},
    name: keyName,
  }
  if (meta) {
    structure.meta = meta
  }
  return structure
}

exports.areSwitchableTypes = (type1, type2) => {
  if (
    SwitchableTypes.indexOf(type1) === -1 &&
    SwitchableTypes.indexOf(type2) === -1
  ) {
    return false
  }
  for (let option of CanSwitchTypes) {
    const index1 = option.indexOf(type1),
      index2 = option.indexOf(type2)
    if (index1 !== -1 && index2 !== -1 && index1 !== index2) {
      return true
    }
  }
  return false
}

exports.hasTypeChanged = (table, oldTable) => {
  if (!oldTable) {
    return false
  }
  for (let [key, field] of Object.entries(oldTable.schema)) {
    const oldType = field.type
    if (!table.schema[key]) {
      continue
    }
    const newType = table.schema[key].type
    if (oldType !== newType && !exports.areSwitchableTypes(oldType, newType)) {
      return true
    }
  }
  return false
}

exports.TableSaveFunctions = TableSaveFunctions
