import { TableSchema } from "@budibase/types"
import { FieldTypes } from "../../../constants"
import { makeExternalQuery } from "../../../integrations/base/query"
import { Format } from "../../../api/controllers/view/exporters"
import sdk from "../.."

export async function getDatasourceAndQuery(json: any) {
  const datasourceId = json.endpoint.datasourceId
  const datasource = await sdk.datasources.get(datasourceId)
  return makeExternalQuery(datasource, json)
}

export function cleanExportRows(
  rows: any[],
  schema: TableSchema,
  format: string,
  columns?: string[]
) {
  let cleanRows = [...rows]

  const relationships = Object.entries(schema)
    .filter((entry: any[]) => entry[1].type === FieldTypes.LINK)
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
  }

  return cleanRows
}
