import {
  FieldType,
  RelationshipFieldMetadata,
  SearchFilters,
  Table,
} from "@budibase/types"

export function getRelationshipColumns(table: Table): {
  name: string
  definition: RelationshipFieldMetadata
}[] {
  return Object.entries(table.schema)
    .filter(entry => entry[1].type === FieldType.LINK)
    .map(entry => ({
      name: entry[0],
      definition: entry[1] as RelationshipFieldMetadata,
    }))
}

export function getTableIDList(
  tables: Table[]
): { name: string; id: string }[] {
  return tables
    .filter(table => table.originalName)
    .map(table => ({ id: table._id!, name: table.originalName! }))
}

export function updateFilterKeys(
  filters: SearchFilters,
  updates: { original: string; updated: string }[]
): SearchFilters {
  // sort the updates by length first - this is necessary to avoid replacing sub-strings
  updates = updates.sort((a, b) => b.original.length - a.original.length)
  const makeFilterKeyRegex = (str: string) =>
    new RegExp(`^${str}.|:${str}.`, "g")
  for (let filter of Object.values(filters)) {
    if (typeof filter !== "object") {
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
  return filters
}
