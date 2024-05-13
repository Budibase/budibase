import {
  FieldType,
  Table,
  DocumentType,
  SEPARATOR,
  BBReferenceFieldSubType,
  SearchFilters,
  SearchIndex,
  SearchResponse,
  Row,
  RowSearchParams,
} from "@budibase/types"
import { db as dbCore, context } from "@budibase/backend-core"
import { helpers, utils } from "@budibase/shared-core"

export async function paginatedSearch(
  query: SearchFilters,
  params: RowSearchParams
): Promise<SearchResponse<Row>> {
  const appId = context.getAppId()
  return dbCore.paginatedSearch(appId!, SearchIndex.ROWS, query, params)
}

export async function fullSearch(
  query: SearchFilters,
  params: RowSearchParams
): Promise<{ rows: Row[] }> {
  const appId = context.getAppId()
  return dbCore.fullSearch(appId!, SearchIndex.ROWS, query, params)
}

function findColumnInQueries(
  column: string,
  options: RowSearchParams,
  callback: (filter: any) => any
) {
  if (!options.query) {
    return
  }
  for (let filterBlock of Object.values(options.query)) {
    if (typeof filterBlock !== "object") {
      continue
    }
    for (let [key, filter] of Object.entries(filterBlock)) {
      if (key.endsWith(column)) {
        filterBlock[key] = callback(filter)
      }
    }
  }
}

function userColumnMapping(
  column: string,
  options: RowSearchParams,
  isDeprecatedSingleUserColumn: boolean = false,
  isSql: boolean = false
) {
  findColumnInQueries(column, options, (filterValue: any): any => {
    const isArray = Array.isArray(filterValue),
      isString = typeof filterValue === "string"
    if (!isString && !isArray) {
      return filterValue
    }

    const processString = (input: string) => {
      const rowPrefix = DocumentType.ROW + SEPARATOR
      if (input.startsWith(rowPrefix)) {
        return dbCore.getGlobalIDFromUserMetadataID(input)
      } else {
        return input
      }
    }

    if (isDeprecatedSingleUserColumn && filterValue && isString && isSql) {
      // Decreated single users are stored as stringified arrays of a single value
      return JSON.stringify([processString(filterValue)])
    }

    if (isArray) {
      return filterValue.map(el => {
        if (typeof el === "string") {
          return processString(el)
        } else {
          return el
        }
      })
    } else {
      return processString(filterValue)
    }
  })
}

// maps through the search parameters to check if any of the inputs are invalid
// based on the table schema, converts them to something that is valid.
export function searchInputMapping(
  table: Table,
  options: RowSearchParams,
  datasourceOptions: { isSql?: boolean }
) {
  if (!table?.schema) {
    return options
  }
  for (let [key, column] of Object.entries(table.schema)) {
    switch (column.type) {
      case FieldType.BB_REFERENCE_SINGLE: {
        const subtype = column.subtype
        switch (subtype) {
          case BBReferenceFieldSubType.USER:
            userColumnMapping(key, options)
            break

          default:
            utils.unreachable(subtype)
        }
        break
      }
      case FieldType.BB_REFERENCE: {
        userColumnMapping(
          key,
          options,
          helpers.schema.isDeprecatedSingleUserColumn(column),
          datasourceOptions.isSql
        )
        break
      }
    }
  }
  return options
}
