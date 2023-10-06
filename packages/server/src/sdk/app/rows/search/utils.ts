import {
  FieldType,
  FieldTypeSubtypes,
  SearchParams,
  Table,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { db as dbCore } from "@budibase/backend-core"

function findColumnInQueries(
  column: string,
  options: SearchParams,
  callback: <T>(filter: T) => T
) {
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

function userColumnMapping(column: string, options: SearchParams) {
  findColumnInQueries(column, options, (filterValue: any): string => {
    if (typeof filterValue !== "string") {
      return filterValue
    }
    const rowPrefix = DocumentType.ROW + SEPARATOR
    // TODO: at some point in future might want to handle mapping emails to IDs
    if (filterValue.startsWith(rowPrefix)) {
      return dbCore.getGlobalIDFromUserMetadataID(filterValue)
    }
    return filterValue
  })
}

export function searchInputMapping(table: Table, options: SearchParams) {
  for (let [key, column] of Object.entries(table.schema)) {
    switch (column.type) {
      case FieldType.BB_REFERENCE:
        if (column.subtype === FieldTypeSubtypes.BB_REFERENCE.USER) {
          userColumnMapping(key, options)
        }
        break
    }
  }
  return options
}
