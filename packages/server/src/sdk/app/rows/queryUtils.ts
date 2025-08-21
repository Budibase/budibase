import { db, HTTPError } from "@budibase/backend-core"
import {
  FieldType,
  isLogicalSearchOperator,
  SearchFilters,
  Table,
} from "@budibase/types"
import sdk from "../../../sdk"
import { isInternal } from "../tables/utils"

export const validateFilters = (
  filters: SearchFilters,
  validFields: string[]
) => {
  validFields = validFields.map(f => f.toLowerCase())
  for (const key of Object.keys(filters || {}) as (keyof SearchFilters)[]) {
    if (isLogicalSearchOperator(key)) {
      const filter = filters[key]
      if (!filter) {
        continue
      }
      for (const condition of filter.conditions) {
        validateFilters(condition, validFields)
      }
    } else {
      const filter = filters[key]
      if (!filter || typeof filter !== "object") {
        continue
      }

      for (const key of Object.keys(filter)) {
        if (
          !validFields.includes(key.toLowerCase()) &&
          !validFields.includes(db.removeKeyNumbering(key).toLowerCase())
        ) {
          throw new HTTPError(`Invalid filter field: ${key}`, 400)
        }
      }
    }
  }
}

export const getQueryableFields = async (
  table: Table,
  fields?: string[]
): Promise<string[]> => {
  const extractTableFields = async (
    table: Table,
    allowedFields: string[],
    fromTables: string[],
    opts?: { noRelationships?: boolean }
  ): Promise<string[]> => {
    const result = []
    if (isInternal({ table })) {
      result.push("_id")
    }

    for (const field of Object.keys(table.schema).filter(
      f => allowedFields.includes(f) && table.schema[f].visible !== false
    )) {
      const subSchema = table.schema[field]
      const isRelationship = subSchema.type === FieldType.LINK
      // avoid relationship loops
      if (
        isRelationship &&
        (opts?.noRelationships || fromTables.includes(subSchema.tableId))
      ) {
        continue
      }
      if (isRelationship) {
        try {
          const relatedTable = await sdk.tables.getTable(subSchema.tableId)
          const relatedFields = await extractTableFields(
            relatedTable,
            Object.keys(relatedTable.schema),
            [...fromTables, subSchema.tableId],
            // don't let it recurse back and forth between relationships
            { noRelationships: true }
          )

          result.push(
            ...relatedFields.flatMap(f => [
              `${subSchema.name}.${f}`,
              // should be able to filter by relationship using table name
              `${relatedTable.name}.${f}`,
            ])
          )
        } catch (err: any) {
          // if related table is removed, ignore
          if (err.status !== 404) {
            throw err
          }
        }
      } else {
        result.push(field)
      }
    }
    return result
  }

  // Querying by _id is always allowed, even if it's never part of the schema
  const result = ["_id"]

  if (fields == null) {
    fields = Object.keys(table.schema)
  }
  result.push(...(await extractTableFields(table, fields, [table._id!])))

  return Array.from(new Set(result))
}
