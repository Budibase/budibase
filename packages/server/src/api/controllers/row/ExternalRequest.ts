import {
  FilterTypes,
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
  isRowId,
  convertRowId,
} from "../../../integrations/utils"
import { getDatasourceAndQuery } from "./utils"
import {
  DataSourceOperation,
  FieldTypes,
  RelationshipTypes,
} from "../../../constants"
import { breakExternalTableId, isSQL } from "../../../integrations/utils"
import { processObjectSync } from "@budibase/string-templates"
// @ts-ignore
import { cloneDeep } from "lodash/fp"
import { processFormulas } from "../../../utilities/rowProcessor/utils"
// @ts-ignore
import { getAppDB } from "@budibase/backend-core/context"

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
  rows?: Row[]
}

module External {
  function buildFilters(
    id: string | undefined | string[],
    filters: SearchFilters,
    table: Table
  ) {
    const primary = table.primary
    // if passed in array need to copy for shifting etc
    let idCopy: undefined | string | any[] = cloneDeep(id)
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

  /**
   * This function checks the incoming parameters to make sure all the inputs are
   * valid based on on the table schema. The main thing this is looking for is when a
   * user has made use of the _id field of a row for a foreign key or a search parameter.
   * In these cases the key will be sent up as [1], rather than 1. In these cases we will
   * simplify it down to the requirements. This function is quite complex as we try to be
   * relatively restrictive over what types of columns we will perform this action for.
   */
  function cleanupConfig(config: RunConfig, table: Table): RunConfig {
    const primaryOptions = [
      FieldTypes.STRING,
      FieldTypes.LONGFORM,
      FieldTypes.OPTIONS,
      FieldTypes.NUMBER,
    ]
    // filter out fields which cannot be keys
    const fieldNames = Object.entries(table.schema)
      .filter(schema => primaryOptions.find(val => val === schema[1].type))
      .map(([fieldName]) => fieldName)
    const iterateObject = (obj: { [key: string]: any }) => {
      for (let [field, value] of Object.entries(obj)) {
        if (fieldNames.find(name => name === field) && isRowId(value)) {
          obj[field] = convertRowId(value)
        }
      }
    }
    // check the row and filters to make sure they aren't a key of some sort
    if (config.filters) {
      for (let [key, filter] of Object.entries(config.filters)) {
        // oneOf is an array, don't iterate it
        if (
          typeof filter !== "object" ||
          Object.keys(filter).length === 0 ||
          key === FilterTypes.ONE_OF
        ) {
          continue
        }
        iterateObject(filter)
      }
    }
    if (config.row) {
      iterateObject(config.row)
    }

    return config
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

  function basicProcessing(row: Row, table: Table): Row {
    const thisRow: Row = {}
    // filter the row down to what is actually the row (not joined)
    for (let fieldName of Object.keys(table.schema)) {
      const pathValue = row[`${table.name}.${fieldName}`]
      const value = pathValue != null ? pathValue : row[fieldName]
      // all responses include "select col as table.col" so that overlaps are handled
      if (value != null) {
        thisRow[fieldName] = value
      }
    }
    thisRow._id = generateIdForRow(row, table)
    thisRow.tableId = table._id
    thisRow._rev = "rev"
    return processFormulas(table, thisRow)
  }

  function fixArrayTypes(row: Row, table: Table) {
    for (let [fieldName, schema] of Object.entries(table.schema)) {
      if (
        schema.type === FieldTypes.ARRAY &&
        typeof row[fieldName] === "string"
      ) {
        try {
          row[fieldName] = JSON.parse(row[fieldName])
        } catch (err) {
          // couldn't convert back to array, ignore
          delete row[fieldName]
        }
      }
    }
    return row
  }

  function isOneSide(field: FieldSchema) {
    return (
      field.relationshipType && field.relationshipType.split("-")[0] === "one"
    )
  }

  class ExternalRequest {
    private operation: Operation
    private tableId: string
    private datasource: Datasource
    private tables: { [key: string]: Table } = {}

    constructor(operation: Operation, tableId: string, datasource: Datasource) {
      this.operation = operation
      this.tableId = tableId
      this.datasource = datasource
      if (datasource && datasource.entities) {
        this.tables = datasource.entities
      }
    }

    getTable(tableId: string | undefined): Table | undefined {
      if (!tableId) {
        throw "Table ID is unknown, cannot find table"
      }
      const { tableName } = breakExternalTableId(tableId)
      if (tableName) {
        return this.tables[tableName]
      }
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
        if (
          row[key] == null ||
          newRow[key] ||
          field.autocolumn ||
          field.type === FieldTypes.FORMULA
        ) {
          continue
        }
        // if its an empty string then it means return the column to null (if possible)
        if (row[key] === "") {
          newRow[key] = null
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
        const { tableName: linkTableName } = breakExternalTableId(
          field?.tableId
        )
        // table has to exist for many to many
        if (!linkTableName || !this.tables[linkTableName]) {
          continue
        }
        const linkTable = this.tables[linkTableName]
        // @ts-ignore
        const linkTablePrimary = linkTable.primary[0]
        // one to many
        if (isOneSide(field)) {
          newRow[field.foreignKey || linkTablePrimary] = breakRowIdField(
            row[key][0]
          )[0]
        }
        // many to many
        else if (field.through) {
          // we're not inserting a doc, will be a bunch of update calls
          const otherKey: string = field.throughFrom || linkTablePrimary
          const thisKey: string = field.throughTo || tablePrimary
          row[key].map((relationship: any) => {
            manyRelationships.push({
              tableId: field.through || field.tableId,
              isUpdate: false,
              key: otherKey,
              [otherKey]: breakRowIdField(relationship)[0],
              // leave the ID for enrichment later
              [thisKey]: `{{ literal ${tablePrimary} }}`,
            })
          })
        }
        // many to one
        else {
          const thisKey: string = "id"
          // @ts-ignore
          const otherKey: string = field.fieldName
          row[key].map((relationship: any) => {
            manyRelationships.push({
              tableId: field.tableId,
              isUpdate: true,
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

    squashRelationshipColumns(
      table: Table,
      row: Row,
      relationships: RelationshipsJson[]
    ): Row {
      for (let relationship of relationships) {
        const linkedTable = this.tables[relationship.tableName]
        if (!linkedTable || !row[relationship.column]) {
          continue
        }
        const display = linkedTable.primaryDisplay
        for (let key of Object.keys(row[relationship.column])) {
          const related: Row = row[relationship.column][key]
          row[relationship.column][key] = {
            primaryDisplay: display ? related[display] : undefined,
            _id: related._id,
          }
        }
      }
      return row
    }

    /**
     * This iterates through the returned rows and works out what elements of the rows
     * actually match up to another row (based on primary keys) - this is pretty specific
     * to SQL and the way that SQL relationships are returned based on joins.
     * This is complicated, but the idea is that when a SQL query returns all the relations
     * will be separate rows, with all of the data in each row. We have to decipher what comes
     * from where (which tables) and how to convert that into budibase columns.
     */
    updateRelationshipColumns(
      table: Table,
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
        const fromColumn = `${table.name}.${relationship.from}`
        const toColumn = `${linkedTable.name}.${relationship.to}`
        // this is important when working with multiple relationships
        // between the same tables, don't want to overlap/multiply the relations
        if (!relationship.through && row[fromColumn] !== row[toColumn]) {
          continue
        }
        let linked = basicProcessing(row, linkedTable)
        if (!linked._id) {
          continue
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
      rows: Row[] = [],
      table: Table,
      relationships: RelationshipsJson[]
    ) {
      if (!rows || rows.length === 0 || rows[0].read === true) {
        return []
      }
      let finalRows: { [key: string]: Row } = {}
      for (let row of rows) {
        const rowId = generateIdForRow(row, table)
        row._id = rowId
        // this is a relationship of some sort
        if (finalRows[rowId]) {
          finalRows = this.updateRelationshipColumns(
            table,
            row,
            finalRows,
            relationships
          )
          continue
        }
        const thisRow = fixArrayTypes(basicProcessing(row, table), table)
        if (thisRow._id == null) {
          throw "Unable to generate row ID for SQL rows"
        }
        finalRows[thisRow._id] = thisRow
        // do this at end once its been added to the final rows
        finalRows = this.updateRelationshipColumns(
          table,
          row,
          finalRows,
          relationships
        )
      }
      return processFormulas(table, Object.values(finalRows)).map((row: Row) =>
        this.squashRelationshipColumns(table, row, relationships)
      )
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
        if (!linkTableName || !this.tables[linkTableName]) {
          continue
        }
        const linkTable = this.tables[linkTableName]
        if (!table.primary || !linkTable.primary) {
          continue
        }
        const definition: any = {
          // if no foreign key specified then use the name of the field in other table
          from: field.foreignKey || table.primary[0],
          to: field.fieldName,
          tableName: linkTableName,
          // need to specify where to put this back into
          column: fieldName,
        }
        if (field.through) {
          const { tableName: throughTableName } = breakExternalTableId(
            field.through
          )
          definition.through = throughTableName
          // don't support composite keys for relationships
          definition.from = field.throughTo || table.primary[0]
          definition.to = field.throughFrom || linkTable.primary[0]
          definition.fromPrimary = table.primary[0]
          definition.toPrimary = linkTable.primary[0]
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
      if (!tableName) {
        return related
      }
      const table = this.tables[tableName]
      // @ts-ignore
      const primaryKey = table.primary[0]
      // make a new request to get the row with all its relationships
      // we need this to work out if any relationships need removed
      for (let field of Object.values(table.schema)) {
        if (
          field.type !== FieldTypes.LINK ||
          !field.fieldName ||
          isOneSide(field)
        ) {
          continue
        }
        const isMany = field.relationshipType === RelationshipTypes.MANY_TO_MANY
        const tableId = isMany ? field.through : field.tableId
        const { tableName: relatedTableName } = breakExternalTableId(tableId)
        // @ts-ignore
        const linkPrimaryKey = this.tables[relatedTableName].primary[0]
        const manyKey = field.throughTo || primaryKey
        const lookupField = isMany ? primaryKey : field.foreignKey
        const fieldName = isMany ? manyKey : field.fieldName
        if (!lookupField || !row[lookupField]) {
          continue
        }
        const response = await getDatasourceAndQuery({
          endpoint: getEndpoint(tableId, DataSourceOperation.READ),
          filters: {
            equal: {
              [fieldName]: row[lookupField],
            },
          },
        })
        // this is the response from knex if no rows found
        const rows = !response[0].read ? response : []
        const storeTo = isMany ? field.throughFrom || linkPrimaryKey : manyKey
        related[storeTo] = { rows, isMany, tableId }
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
      // if we're creating (in a through table) need to wipe the existing ones first
      const promises = []
      const related = await this.lookupRelations(mainTableId, row)
      for (let relationship of relationships) {
        const { key, tableId, isUpdate, id, ...rest } = relationship
        const body: { [key: string]: any } = processObjectSync(rest, row, {})
        const linkTable = this.getTable(tableId)
        // @ts-ignore
        const linkPrimary = linkTable?.primary[0]
        if (!linkTable || !linkPrimary) {
          return
        }
        const rows = related[key]?.rows || []
        const found = rows.find(
          (row: { [key: string]: any }) =>
            row[linkPrimary] === relationship.id ||
            row[linkPrimary] === body?.[linkPrimary]
        )
        const operation = isUpdate
          ? DataSourceOperation.UPDATE
          : DataSourceOperation.CREATE
        if (!found) {
          promises.push(
            getDatasourceAndQuery({
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
        const table: Table | undefined = this.getTable(tableId)
        // if its not the foreign key skip it, nothing to do
        if (
          !table ||
          (table.primary && table.primary.indexOf(colName) !== -1)
        ) {
          continue
        }
        for (let row of rows) {
          const filters = buildFilters(generateIdForRow(row, table), {}, table)
          // safety check, if there are no filters on deletion bad things happen
          if (Object.keys(filters).length !== 0) {
            const op = isMany
              ? DataSourceOperation.DELETE
              : DataSourceOperation.UPDATE
            const body = isMany ? null : { [colName]: null }
            promises.push(
              getDatasourceAndQuery({
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
      function extractRealFields(table: Table, existing: string[] = []) {
        return Object.entries(table.schema)
          .filter(
            column =>
              column[1].type !== FieldTypes.LINK &&
              column[1].type !== FieldTypes.FORMULA &&
              !existing.find((field: string) => field === column[0])
          )
          .map(column => `${table.name}.${column[0]}`)
      }
      let fields = extractRealFields(table)
      for (let field of Object.values(table.schema)) {
        if (field.type !== FieldTypes.LINK || !includeRelations) {
          continue
        }
        const { tableName: linkTableName } = breakExternalTableId(field.tableId)
        if (linkTableName) {
          const linkTable = this.tables[linkTableName]
          if (linkTable) {
            const linkedFields = extractRealFields(linkTable, fields)
            fields = fields.concat(linkedFields)
          }
        }
      }
      return fields
    }

    async run(config: RunConfig) {
      const { operation, tableId } = this
      let { datasourceId, tableName } = breakExternalTableId(tableId)
      if (!tableName) {
        throw "Unable to run without a table name"
      }
      if (!this.datasource) {
        const db = getAppDB()
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
      // look for specific components of config which may not be considered acceptable
      let { id, row, filters, sort, paginate, rows } = cleanupConfig(
        config,
        table
      )
      filters = buildFilters(id, filters || {}, table)
      const relationships = this.buildRelationships(table)
      // clean up row on ingress using schema
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
        body: row || rows,
        // pass an id filter into extra, purely for mysql/returning
        extra: {
          idFilter: buildFilters(id || generateIdForRow(row, table), {}, table),
        },
        meta: {
          table,
        },
      }
      // can't really use response right now
      const response = await getDatasourceAndQuery(json)
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
