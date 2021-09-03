import {
  IncludeRelationships,
  Operation,
  PaginationJson,
  RelationshipsJson,
  SearchFilters,
  SortJson,
} from "../../../definitions/datasource"
import {
  Datasource,
  FieldSchema,
  Row,
  Table,
} from "../../../definitions/common"
import {
  breakRowIdField,
  generateRowIdField,
} from "../../../integrations/utils"
import { RelationshipTypes } from "../../../constants"

interface ManyRelationship {
  tableId?: string
  id?: string
  isUpdate?: boolean
  key: string
  [key: string]: any
}

interface RunConfig {
  id?: string
  filters?: SearchFilters
  sort?: SortJson
  paginate?: PaginationJson
  row?: Row
}

module External {
  const { makeExternalQuery } = require("./utils")
  const { DataSourceOperation, FieldTypes } = require("../../../constants")
  const { breakExternalTableId, isSQL } = require("../../../integrations/utils")
  const { processObjectSync } = require("@budibase/string-templates")
  const { cloneDeep } = require("lodash/fp")
  const CouchDB = require("../../../db")

  function buildFilters(
    id: string | undefined,
    filters: SearchFilters,
    table: Table
  ) {
    const primary = table.primary
    // if passed in array need to copy for shifting etc
    let idCopy = cloneDeep(id)
    if (filters) {
      // need to map over the filters and make sure the _id field isn't present
      for (let filter of Object.values(filters)) {
        if (filter._id && primary) {
          const parts = breakRowIdField(filter._id)
          for (let field of primary) {
            filter[field] = parts.shift()
          }
        }
        // make sure this field doesn't exist on any filter
        delete filter._id
      }
    }
    // there is no id, just use the user provided filters
    if (!idCopy || !table) {
      return filters
    }
    // if used as URL parameter it will have been joined
    if (!Array.isArray(idCopy)) {
      idCopy = breakRowIdField(idCopy)
    }
    const equal: any = {}
    if (primary && idCopy) {
      for (let field of primary) {
        // work through the ID and get the parts
        equal[field] = idCopy.shift()
      }
    }
    return {
      equal,
    }
  }

  function generateIdForRow(row: Row | undefined, table: Table): string {
    const primary = table.primary
    if (!row || !primary) {
      return ""
    }
    // build id array
    let idParts = []
    for (let field of primary) {
      // need to handle table name + field or just field, depending on if relationships used
      const fieldValue = row[`${table.name}.${field}`] || row[field]
      if (fieldValue) {
        idParts.push(fieldValue)
      }
    }
    if (idParts.length === 0) {
      return ""
    }
    return generateRowIdField(idParts)
  }

  function getEndpoint(tableId: string | undefined, operation: string) {
    if (!tableId) {
      return {}
    }
    const { datasourceId, tableName } = breakExternalTableId(tableId)
    return {
      datasourceId,
      entityId: tableName,
      operation,
    }
  }

  function basicProcessing(row: Row, table: Table) {
    const thisRow: { [key: string]: any } = {}
    // filter the row down to what is actually the row (not joined)
    for (let fieldName of Object.keys(table.schema)) {
      const value = row[`${table.name}.${fieldName}`] || row[fieldName]
      // all responses include "select col as table.col" so that overlaps are handled
      if (value) {
        thisRow[fieldName] = value
      }
    }
    thisRow._id = generateIdForRow(row, table)
    thisRow.tableId = table._id
    thisRow._rev = "rev"
    return thisRow
  }

  function isMany(field: FieldSchema) {
    return (
      field.relationshipType && field.relationshipType.split("-")[0] === "many"
    )
  }

  class ExternalRequest {
    private readonly appId: string
    private operation: Operation
    private tableId: string
    private datasource: Datasource
    private tables: { [key: string]: Table } = {}

    constructor(
      appId: string,
      operation: Operation,
      tableId: string,
      datasource: Datasource
    ) {
      this.appId = appId
      this.operation = operation
      this.tableId = tableId
      this.datasource = datasource
      if (datasource && datasource.entities) {
        this.tables = datasource.entities
      }
    }

    getTable(tableId: string | undefined): Table {
      if (!tableId) {
        throw "Table ID is unknown, cannot find table"
      }
      const { tableName } = breakExternalTableId(tableId)
      return this.tables[tableName]
    }

    inputProcessing(row: Row | undefined, table: Table) {
      if (!row) {
        return { row, manyRelationships: [] }
      }
      // we don't really support composite keys for relationships, this is why [0] is used
      // @ts-ignore
      const tablePrimary: string = table.primary[0]
      let newRow: Row = {},
        manyRelationships: ManyRelationship[] = []
      for (let [key, field] of Object.entries(table.schema)) {
        // if set already, or not set just skip it
        if (!row[key] || newRow[key] || field.autocolumn) {
          continue
        }
        // parse floats/numbers
        if (field.type === FieldTypes.NUMBER && !isNaN(parseFloat(row[key]))) {
          newRow[key] = parseFloat(row[key])
        }
        // if its not a link then just copy it over
        if (field.type !== FieldTypes.LINK) {
          newRow[key] = row[key]
          continue
        }
        const { tableName: linkTableName } = breakExternalTableId(field.tableId)
        // table has to exist for many to many
        if (!this.tables[linkTableName]) {
          continue
        }
        const linkTable = this.tables[linkTableName]
        // @ts-ignore
        const linkTablePrimary = linkTable.primary[0]
        if (!isMany(field)) {
          newRow[field.foreignKey || linkTablePrimary] = breakRowIdField(
            row[key][0]
          )[0]
        } else {
          // we're not inserting a doc, will be a bunch of update calls
          const isUpdate = !field.through
          const thisKey: string = isUpdate ? "id" : linkTablePrimary
          // @ts-ignore
          const otherKey: string = isUpdate ? field.fieldName : tablePrimary
          row[key].map((relationship: any) => {
            // we don't really support composite keys for relationships, this is why [0] is used
            manyRelationships.push({
              tableId: field.through || field.tableId,
              isUpdate,
              key: otherKey,
              [thisKey]: breakRowIdField(relationship)[0],
              // leave the ID for enrichment later
              [otherKey]: `{{ literal ${tablePrimary} }}`,
            })
          })
        }
      }
      // we return the relationships that may need to be created in the through table
      // we do this so that if the ID is generated by the DB it can be inserted
      // after the fact
      return { row: newRow, manyRelationships }
    }

    /**
     * This iterates through the returned rows and works out what elements of the rows
     * actually match up to another row (based on primary keys) - this is pretty specific
     * to SQL and the way that SQL relationships are returned based on joins.
     */
    updateRelationshipColumns(
      row: Row,
      rows: { [key: string]: Row },
      relationships: RelationshipsJson[]
    ) {
      const columns: { [key: string]: any } = {}
      for (let relationship of relationships) {
        const linkedTable = this.tables[relationship.tableName]
        if (!linkedTable) {
          continue
        }
        let linked = basicProcessing(row, linkedTable)
        if (!linked._id) {
          continue
        }
        // if not returning full docs then get the minimal links out
        const display = linkedTable.primaryDisplay
        linked = {
          primaryDisplay: display ? linked[display] : undefined,
          _id: linked._id,
        }
        columns[relationship.column] = linked
      }
      for (let [column, related] of Object.entries(columns)) {
        if (!row._id) {
          continue
        }
        const rowId: string = row._id
        if (!Array.isArray(rows[rowId][column])) {
          rows[rowId][column] = []
        }
        // make sure relationship hasn't been found already
        if (
          !rows[rowId][column].find(
            (relation: Row) => relation._id === related._id
          )
        ) {
          rows[rowId][column].push(related)
        }
      }
      return rows
    }

    outputProcessing(
      rows: Row[],
      table: Table,
      relationships: RelationshipsJson[]
    ) {
      if (rows[0].read === true) {
        return []
      }
      let finalRows: { [key: string]: Row } = {}
      for (let row of rows) {
        const rowId = generateIdForRow(row, table)
        row._id = rowId
        // this is a relationship of some sort
        if (finalRows[rowId]) {
          finalRows = this.updateRelationshipColumns(
            row,
            finalRows,
            relationships
          )
          continue
        }
        const thisRow = basicProcessing(row, table)
        finalRows[thisRow._id] = thisRow
        // do this at end once its been added to the final rows
        finalRows = this.updateRelationshipColumns(
          row,
          finalRows,
          relationships
        )
      }
      return Object.values(finalRows)
    }

    /**
     * Gets the list of relationship JSON structures based on the columns in the table,
     * this will be used by the underlying library to build whatever relationship mechanism
     * it has (e.g. SQL joins).
     */
    buildRelationships(table: Table): RelationshipsJson[] {
      const relationships = []
      for (let [fieldName, field] of Object.entries(table.schema)) {
        if (field.type !== FieldTypes.LINK) {
          continue
        }
        const { tableName: linkTableName } = breakExternalTableId(field.tableId)
        // no table to link to, this is not a valid relationships
        if (!this.tables[linkTableName]) {
          continue
        }
        const linkTable = this.tables[linkTableName]
        if (!table.primary || !linkTable.primary) {
          continue
        }
        const definition = {
          // if no foreign key specified then use the name of the field in other table
          from: field.foreignKey || table.primary[0],
          to: field.fieldName,
          tableName: linkTableName,
          through: undefined,
          // need to specify where to put this back into
          column: fieldName,
        }
        if (field.through) {
          const { tableName: throughTableName } = breakExternalTableId(
            field.through
          )
          definition.through = throughTableName
          // don't support composite keys for relationships
          definition.from = table.primary[0]
          definition.to = linkTable.primary[0]
        }
        relationships.push(definition)
      }
      return relationships
    }

    /**
     * This is a cached lookup, of relationship records, this is mainly for creating/deleting junction
     * information.
     */
    async lookupRelations(tableId: string, row: Row) {
      const related: { [key: string]: any } = {}
      const { tableName } = breakExternalTableId(tableId)
      const table = this.tables[tableName]
      // @ts-ignore
      const primaryKey = table.primary[0]
      // make a new request to get the row with all its relationships
      // we need this to work out if any relationships need removed
      for (let field of Object.values(table.schema)) {
        if (field.type !== FieldTypes.LINK || !field.fieldName) {
          continue
        }
        const isMany = field.relationshipType === RelationshipTypes.MANY_TO_MANY
        const tableId = isMany ? field.through : field.tableId
        const fieldName = isMany ? primaryKey : field.fieldName
        const response = await makeExternalQuery(this.appId, {
          endpoint: getEndpoint(tableId, DataSourceOperation.READ),
          filters: {
            equal: {
              [fieldName]: row[primaryKey],
            },
          },
        })
        // this is the response from knex if no rows found
        const rows = !response[0].read ? response : []
        related[fieldName] = { rows, isMany, tableId }
      }
      return related
    }

    /**
     * Once a row has been written we may need to update a many field, e.g. updating foreign keys
     * in a bunch of rows in another table, or inserting/deleting rows from a junction table (many to many).
     * This is quite a complex process and is handled by this function, there are a few things going on here:
     * 1. If updating foreign keys its relatively simple, just create a filter for the row that needs updated
     * and write the various components.
     * 2. If junction table, then we lookup what exists already, write what doesn't exist, work out what
     * isn't supposed to exist anymore and delete those. This is better than the usual method of delete them
     * all and then re-create, as theres no chance of losing data (e.g. delete succeed, but write fail).
     */
    async handleManyRelationships(
      mainTableId: string,
      row: Row,
      relationships: ManyRelationship[]
    ) {
      const { appId } = this
      // if we're creating (in a through table) need to wipe the existing ones first
      const promises = []
      const related = await this.lookupRelations(mainTableId, row)
      for (let relationship of relationships) {
        const { key, tableId, isUpdate, id, ...rest } = relationship
        const body = processObjectSync(rest, row)
        const linkTable = this.getTable(tableId)
        // @ts-ignore
        const linkPrimary = linkTable.primary[0]
        const rows = related[key].rows || []
        const found = rows.find(
          (row: { [key: string]: any }) =>
            row[linkPrimary] === relationship.id ||
            row[linkPrimary] === body[linkPrimary]
        )
        const operation = isUpdate
          ? DataSourceOperation.UPDATE
          : DataSourceOperation.CREATE
        if (!found) {
          promises.push(
            makeExternalQuery(appId, {
              endpoint: getEndpoint(tableId, operation),
              // if we're doing many relationships then we're writing, only one response
              body,
              filters: buildFilters(id, {}, linkTable),
            })
          )
        } else {
          // remove the relationship from cache so it isn't adjusted again
          rows.splice(rows.indexOf(found), 1)
        }
      }
      // finally cleanup anything that needs to be removed
      for (let [colName, { isMany, rows, tableId }] of Object.entries(
        related
      )) {
        const table = this.getTable(tableId)
        for (let row of rows) {
          const filters = buildFilters(generateIdForRow(row, table), {}, table)
          // safety check, if there are no filters on deletion bad things happen
          if (Object.keys(filters).length !== 0) {
            const op = isMany
              ? DataSourceOperation.DELETE
              : DataSourceOperation.UPDATE
            const body = isMany ? null : { [colName]: null }
            promises.push(
              makeExternalQuery(this.appId, {
                endpoint: getEndpoint(tableId, op),
                body,
                filters,
              })
            )
          }
        }
      }
      await Promise.all(promises)
    }

    /**
     * This function is a bit crazy, but the exact purpose of it is to protect against the scenario in which
     * you have column overlap in relationships, e.g. we join a few different tables and they all have the
     * concept of an ID, but for some of them it will be null (if they say don't have a relationship).
     * Creating the specific list of fields that we desire, and excluding the ones that are no use to us
     * is more performant and has the added benefit of protecting against this scenario.
     */
    buildFields(
      table: Table,
      includeRelations: IncludeRelationships = IncludeRelationships.INCLUDE
    ) {
      function extractNonLinkFieldNames(table: Table, existing: string[] = []) {
        return Object.entries(table.schema)
          .filter(
            column =>
              column[1].type !== FieldTypes.LINK &&
              !existing.find((field: string) => field === column[0])
          )
          .map(column => `${table.name}.${column[0]}`)
      }
      let fields = extractNonLinkFieldNames(table)
      for (let field of Object.values(table.schema)) {
        if (field.type !== FieldTypes.LINK || !includeRelations) {
          continue
        }
        const { tableName: linkTableName } = breakExternalTableId(field.tableId)
        const linkTable = this.tables[linkTableName]
        if (linkTable) {
          const linkedFields = extractNonLinkFieldNames(linkTable, fields)
          fields = fields.concat(linkedFields)
        }
      }
      return fields
    }

    async run({ id, row, filters, sort, paginate }: RunConfig) {
      const { appId, operation, tableId } = this
      let { datasourceId, tableName } = breakExternalTableId(tableId)
      if (!this.datasource) {
        const db = new CouchDB(appId)
        this.datasource = await db.get(datasourceId)
        if (!this.datasource || !this.datasource.entities) {
          throw "No tables found, fetch tables before query."
        }
        this.tables = this.datasource.entities
      }
      const table = this.tables[tableName]
      let isSql = isSQL(this.datasource)
      if (!table) {
        throw `Unable to process query, table "${tableName}" not defined.`
      }
      // clean up row on ingress using schema
      filters = buildFilters(id, filters || {}, table)
      const relationships = this.buildRelationships(table)
      const processed = this.inputProcessing(row, table)
      row = processed.row
      if (
        operation === DataSourceOperation.DELETE &&
        (filters == null || Object.keys(filters).length === 0)
      ) {
        throw "Deletion must be filtered"
      }
      let json = {
        endpoint: {
          datasourceId,
          entityId: tableName,
          operation,
        },
        resource: {
          // have to specify the fields to avoid column overlap (for SQL)
          fields: isSql ? this.buildFields(table) : [],
        },
        filters,
        sort,
        paginate,
        relationships,
        body: row,
        // pass an id filter into extra, purely for mysql/returning
        extra: {
          idFilter: buildFilters(id || generateIdForRow(row, table), {}, table),
        },
      }
      // can't really use response right now
      const response = await makeExternalQuery(appId, json)
      // handle many to many relationships now if we know the ID (could be auto increment)
      if (
        operation !== DataSourceOperation.READ &&
        processed.manyRelationships
      ) {
        await this.handleManyRelationships(
          table._id || "",
          response[0],
          processed.manyRelationships
        )
      }
      const output = this.outputProcessing(response, table, relationships)
      // if reading it'll just be an array of rows, return whole thing
      return operation === DataSourceOperation.READ && Array.isArray(response)
        ? output
        : { row: output[0], table }
    }
  }

  module.exports = ExternalRequest
}
