import {
  FieldType,
  RelationshipFieldMetadata,
  SearchFilters,
  Table,
} from "@budibase/types"
import { isPlainObject } from "lodash"
import { dataFilters } from "@budibase/shared-core"

export function getRelationshipColumns(table: Table): {
  name: string
  definition: RelationshipFieldMetadata
}[] {
  // performing this with a for loop rather than an array filter improves
  // type guarding, as no casts are required
  const linkEntries: [string, RelationshipFieldMetadata][] = []
  for (let entry of Object.entries(table.schema)) {
    if (entry[1].type === FieldType.LINK) {
      const linkColumn: RelationshipFieldMetadata = entry[1]
      linkEntries.push([entry[0], linkColumn])
    }
  }
  return linkEntries.map(entry => ({
    name: entry[0],
    definition: entry[1],
  }))
}

export function getTableIDList(
  tables: Table[]
): { name: string; id: string }[] {
  return tables
    .filter(table => table.originalName && table._id)
    .map(table => ({ id: table._id!, name: table.originalName! }))
}

export function updateFilterKeys(
  filters: SearchFilters,
  updates: { original: string; updated: string }[]
): SearchFilters {
  const makeFilterKeyRegex = (str: string) =>
    new RegExp(`^${str}\\.|:${str}\\.`)
  for (let filter of Object.values(filters)) {
    if (!isPlainObject(filter)) {
      continue
    }
    for (let [key, keyFilter] of Object.entries(filter)) {
      if (keyFilter === "") {
        delete filter[key]
      }
      const possibleKey = updates.find(({ original }) =>
        key.match(makeFilterKeyRegex(original))
      )
      if (possibleKey && possibleKey.original !== possibleKey.updated) {
        // only replace the first, not replaceAll
        filter[key.replace(possibleKey.original, possibleKey.updated)] =
          filter[key]
        delete filter[key]
      }
    }
  }
  return dataFilters.recurseLogicalOperators(filters, (f: SearchFilters) => {
    return updateFilterKeys(f, updates)
  })
}
