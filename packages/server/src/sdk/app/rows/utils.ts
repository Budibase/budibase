import validateJs from "validate.js"
import dayjs from "dayjs"
import cloneDeep from "lodash/fp/cloneDeep"
import {
  Datasource,
  DatasourcePlusQueryResponse,
  FieldConstraints,
  FieldType,
  QueryJson,
  Row,
  SourceName,
  Table,
  TableSchema,
  SqlClient,
  ArrayOperator,
  ViewV2,
  EnrichedQueryJson,
} from "@budibase/types"
import { Format } from "../../../api/controllers/view/exporters"
import sdk from "../.."
import { extractViewInfoFromID, isRelationshipColumn } from "../../../db/utils"
import { isSQL } from "../../../integrations/utils"
import { docIds, sql, SQS_DATASOURCE_INTERNAL } from "@budibase/backend-core"
import { getTableFromSource } from "../../../api/controllers/row/utils"
import env from "../../../environment"

const SQL_CLIENT_SOURCE_MAP: Record<SourceName, SqlClient | undefined> = {
  [SourceName.POSTGRES]: SqlClient.POSTGRES,
  [SourceName.MYSQL]: SqlClient.MY_SQL,
  [SourceName.SQL_SERVER]: SqlClient.MS_SQL,
  [SourceName.ORACLE]: SqlClient.ORACLE,
  [SourceName.DYNAMODB]: undefined,
  [SourceName.MONGODB]: undefined,
  [SourceName.ELASTICSEARCH]: undefined,
  [SourceName.COUCHDB]: undefined,
  [SourceName.S3]: undefined,
  [SourceName.AIRTABLE]: undefined,
  [SourceName.ARANGODB]: undefined,
  [SourceName.REST]: undefined,
  [SourceName.FIRESTORE]: undefined,
  [SourceName.GOOGLE_SHEETS]: undefined,
  [SourceName.REDIS]: undefined,
  [SourceName.SNOWFLAKE]: undefined,
  [SourceName.BUDIBASE]: undefined,
}

const XSS_INPUT_REGEX =
  /[<>;"'(){}]|--|\/\*|\*\/|union|select|insert|drop|delete|update|exec|script/i

export function getSQLClient(datasource: Datasource): SqlClient {
  if (!isSQL(datasource)) {
    throw new Error("Cannot get SQL Client for non-SQL datasource")
  }
  const lookup = SQL_CLIENT_SOURCE_MAP[datasource.source]
  if (lookup) {
    return lookup
  }
  throw new Error("Unable to determine client for SQL datasource")
}

export function processRowCountResponse(
  response: DatasourcePlusQueryResponse
): number {
  if (
    response &&
    response.length === 1 &&
    sql.COUNT_FIELD_NAME in response[0]
  ) {
    const total = response[0][sql.COUNT_FIELD_NAME]
    return typeof total === "number" ? total : parseInt(total)
  } else {
    throw new Error("Unable to count rows in query - no count response")
  }
}

function processInternalTables(tables: Table[]) {
  const tableMap: Record<string, Table> = {}
  for (let table of tables) {
    // update the table name, should never query by name for SQLite
    table.originalName = table.name
    table.name = table._id!
    tableMap[table._id!] = table
  }
  return tableMap
}

export async function enrichQueryJson(
  json: QueryJson
): Promise<EnrichedQueryJson> {
  let datasource: Datasource | undefined = undefined

  if (typeof json.endpoint.datasourceId === "string") {
    if (json.endpoint.datasourceId !== SQS_DATASOURCE_INTERNAL) {
      datasource = await sdk.datasources.get(json.endpoint.datasourceId, {
        enriched: true,
      })
    }
  } else {
    datasource = await sdk.datasources.enrich(json.endpoint.datasourceId)
  }

  let tables: Record<string, Table>
  if (datasource) {
    tables = datasource.entities || {}
  } else {
    tables = processInternalTables(await sdk.tables.getAllInternalTables())
  }

  let table: Table
  if (typeof json.endpoint.entityId === "string") {
    let entityId = json.endpoint.entityId
    if (docIds.isDatasourceId(entityId)) {
      entityId = sql.utils.breakExternalTableId(entityId).tableName
    }
    table = tables[entityId]
  } else {
    table = json.endpoint.entityId
  }

  return {
    operation: json.endpoint.operation,
    table,
    tables,
    datasource,
    schema: json.endpoint.schema,
    ...json,
  }
}

export function cleanExportRows(
  rows: Row[],
  schema: TableSchema,
  format: string,
  columns?: string[],
  customHeaders: { [key: string]: string } = {}
) {
  let cleanRows = [...rows]

  const relationships = Object.entries(schema)
    .filter((entry: any[]) => entry[1].type === FieldType.LINK)
    .map(entry => entry[0])

  relationships.forEach(column => {
    cleanRows.forEach(row => {
      delete row[column]
    })
    delete schema[column]
  })

  if (format === Format.CSV) {
    // Intended to append empty values in export
    const schemaKeys = Object.keys(schema)
    for (let key of schemaKeys) {
      if (columns?.length && columns.indexOf(key) > 0) {
        continue
      }
      for (let row of cleanRows) {
        if (row[key] == null) {
          row[key] = undefined
        }
      }
    }
  } else if (format === Format.JSON) {
    // Replace row keys with custom headers
    for (let row of cleanRows) {
      renameKeys(customHeaders, row)
    }
  }

  return cleanRows
}

function renameKeys(keysMap: { [key: string]: any }, row: any) {
  for (const key in keysMap) {
    Object.defineProperty(
      row,
      keysMap[key],
      Object.getOwnPropertyDescriptor(row, key) || {}
    )
    delete row[key]
  }
}

function isForeignKey(key: string, table: Table) {
  const relationships = Object.values(table.schema).filter(isRelationshipColumn)
  return relationships.some(
    relationship => (relationship as any).foreignKey === key
  )
}

export async function validate({
  source,
  row,
}: {
  source: Table | ViewV2
  row: Row
}): Promise<{
  valid: boolean
  errors: Record<string, any>
}> {
  const table = await getTableFromSource(source)
  const errors: Record<string, any> = {}
  const disallowArrayTypes = [
    FieldType.ATTACHMENT_SINGLE,
    FieldType.BB_REFERENCE_SINGLE,
  ]
  for (let fieldName of Object.keys(table.schema)) {
    const column = table.schema[fieldName]
    const constraints = cloneDeep(column.constraints)
    const type = column.type
    // foreign keys are likely to be enriched
    if (isForeignKey(fieldName, table)) {
      continue
    }
    // formulas shouldn't validated, data will be deleted anyway
    if (type === FieldType.FORMULA || column.autocolumn) {
      continue
    }
    // special case for options, need to always allow unselected (empty)
    if (type === FieldType.OPTIONS && constraints?.inclusion) {
      constraints.inclusion.push(null as any, "")
    }

    if (disallowArrayTypes.includes(type) && Array.isArray(row[fieldName])) {
      errors[fieldName] = `Cannot accept arrays`
    }
    let res

    // Validate.js doesn't seem to handle array
    if (type === FieldType.ARRAY && row[fieldName]) {
      if (row[fieldName].length) {
        if (!Array.isArray(row[fieldName])) {
          row[fieldName] = row[fieldName].split(",")
        }
        row[fieldName].map((val: any) => {
          if (
            !constraints?.inclusion?.includes(val) &&
            constraints?.inclusion?.length !== 0
          ) {
            errors[fieldName] = "Field not in list"
          }
        })
      } else if (constraints?.presence && row[fieldName].length === 0) {
        // non required MultiSelect creates an empty array, which should not throw errors
        errors[fieldName] = [`${fieldName} is required`]
      }
    } else if (
      (type === FieldType.ATTACHMENTS || type === FieldType.JSON) &&
      typeof row[fieldName] === "string"
    ) {
      // this should only happen if there is an error
      try {
        const json = JSON.parse(row[fieldName])
        if (type === FieldType.ATTACHMENTS) {
          if (Array.isArray(json)) {
            row[fieldName] = json
          } else {
            errors[fieldName] = [`Must be an array`]
          }
        }
      } catch (err) {
        errors[fieldName] = [`Contains invalid JSON`]
      }
    } else if (type === FieldType.DATETIME && column.timeOnly) {
      res = validateTimeOnlyField(fieldName, row[fieldName], constraints)
    } else {
      res = validateJs.single(row[fieldName], constraints)
    }

    if (env.XSS_SAFE_MODE && typeof row[fieldName] === "string") {
      if (XSS_INPUT_REGEX.test(row[fieldName])) {
        errors[fieldName] = [
          "Input not sanitised - potentially vulnerable to XSS",
        ]
      }
    }

    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

function validateTimeOnlyField(
  fieldName: string,
  value: any,
  constraints: FieldConstraints | undefined
) {
  let res
  if (value && !value.match(/^(\d+)(:[0-5]\d){1,2}$/)) {
    res = [`"${fieldName}" is not a valid time`]
  } else if (constraints) {
    let castedValue = value
    const stringTimeToDate = (value: string) => {
      const [hour, minute, second] = value.split(":").map((x: string) => +x)
      let date = dayjs("2000-01-01T00:00:00.000Z").hour(hour).minute(minute)
      if (!isNaN(second)) {
        date = date.second(second)
      }
      return date
    }

    if (castedValue) {
      castedValue = stringTimeToDate(castedValue)
    }
    let castedConstraints = cloneDeep(constraints)

    let earliest, latest
    let easliestTimeString: string, latestTimeString: string
    if (castedConstraints.datetime?.earliest) {
      easliestTimeString = castedConstraints.datetime.earliest
      if (dayjs(castedConstraints.datetime.earliest).isValid()) {
        easliestTimeString = dayjs(castedConstraints.datetime.earliest).format(
          "HH:mm"
        )
      }
      earliest = stringTimeToDate(easliestTimeString)
    }
    if (castedConstraints.datetime?.latest) {
      latestTimeString = castedConstraints.datetime.latest
      if (dayjs(castedConstraints.datetime.latest).isValid()) {
        latestTimeString = dayjs(castedConstraints.datetime.latest).format(
          "HH:mm"
        )
      }
      latest = stringTimeToDate(latestTimeString)
    }

    if (earliest && latest && earliest.isAfter(latest)) {
      latest = latest.add(1, "day")
      if (earliest.isAfter(castedValue)) {
        castedValue = castedValue.add(1, "day")
      }
    }

    if (earliest || latest) {
      castedConstraints.datetime = {
        earliest: earliest?.toISOString() || "",
        latest: latest?.toISOString() || "",
      }
    }

    let jsValidation = validateJs.single(
      castedValue?.toISOString(),
      castedConstraints
    )
    jsValidation = jsValidation?.map((m: string) =>
      m
        ?.replace(
          castedConstraints.datetime?.earliest || "",
          easliestTimeString || ""
        )
        .replace(
          castedConstraints.datetime?.latest || "",
          latestTimeString || ""
        )
    )
    if (jsValidation) {
      res ??= []
      res.push(...jsValidation)
    }
  }

  return res
}

// type-guard check
export function isArrayFilter(operator: any): operator is ArrayOperator {
  return Object.values(ArrayOperator).includes(operator)
}

export function tryExtractingTableAndViewId(tableOrViewId: string) {
  if (docIds.isViewId(tableOrViewId)) {
    return {
      tableId: extractViewInfoFromID(tableOrViewId).tableId,
      viewId: tableOrViewId,
    }
  }

  return { tableId: tableOrViewId }
}

export function getSource(tableOrViewId: string) {
  if (docIds.isViewId(tableOrViewId)) {
    return sdk.views.get(tableOrViewId)
  }
  return sdk.tables.getTable(tableOrViewId)
}
