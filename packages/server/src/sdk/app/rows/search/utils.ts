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

function userColumnMapping(column: string, options: SearchParams) {
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
export function searchInputMapping(table: Table, options: SearchParams) {
  if (!table?.schema) {
    return options
  }
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
