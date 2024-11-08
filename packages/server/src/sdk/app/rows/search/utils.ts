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
import { utils, dataFilters } from "@budibase/shared-core"

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
  filters: SearchFilters,
  callback: (filter: any) => any
) {
  if (!filters) {
    return
  }
  for (let filterBlock of Object.values(filters)) {
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

function userColumnMapping(column: string, filters: SearchFilters) {
  findColumnInQueries(column, filters, (filterValue: any): any => {
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

export function checkFilters(
  table: Table,
  filters: SearchFilters
): SearchFilters {
  for (let [key, column] of Object.entries(table.schema || {})) {
    switch (column.type) {
      case FieldType.BB_REFERENCE_SINGLE: {
        const subtype = column.subtype
        switch (subtype) {
          case BBReferenceFieldSubType.USER:
            userColumnMapping(key, filters)
            break

          default:
            utils.unreachable(subtype)
        }
        break
      }
      case FieldType.BB_REFERENCE: {
        userColumnMapping(key, filters)
        break
      }
    }
  }
  return dataFilters.recurseLogicalOperators(filters, filters =>
    checkFilters(table, filters)
  )
}

// maps through the search parameters to check if any of the inputs are invalid
// based on the table schema, converts them to something that is valid.
export function searchInputMapping(table: Table, options: RowSearchParams) {
  // need an internal function to loop over filters, because this takes the full options
  if (options.query) {
    options.query = checkFilters(table, options.query)
  }
  return options
}

export function isSearchingByRowID(query: SearchFilters): boolean {
  for (let searchField of Object.values(query)) {
    if (typeof searchField !== "object") {
      continue
    }
    const hasId = Object.keys(searchField).find(
      key => dbCore.removeKeyNumbering(key) === "_id" && searchField[key]
    )
    if (hasId) {
      return true
    }
  }
  return false
}
