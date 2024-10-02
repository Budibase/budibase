import { db } from "@budibase/backend-core"
import {
  FieldType,
  isLogicalSearchOperator,
  SearchFilters,
  Table,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import sdk from "../../../sdk"

export const removeInvalidFilters = (
  filters: SearchFilters,
  validFields: string[]
) => {
  const result = cloneDeep(filters)

  validFields = validFields.map(f => f.toLowerCase())
  for (const filterKey of Object.keys(
    result || {}
  ) as (keyof SearchFilters)[]) {
    if (isLogicalSearchOperator(filterKey)) {
      const filter = result[filterKey]
      if (!filter || typeof filter !== "object") {
        continue
      }
      const resultingConditions: SearchFilters[] = []
      for (const condition of filter.conditions) {
        const resultingCondition = removeInvalidFilters(condition, validFields)
        if (Object.keys(resultingCondition || {}).length) {
          resultingConditions.push(resultingCondition)
        }
      }
      if (resultingConditions.length) {
        filter.conditions = resultingConditions
      } else {
        delete result[filterKey]
      }
      continue
    }

    const filter = result[filterKey]
    if (!filter || typeof filter !== "object") {
      continue
    }

    for (const columnKey of Object.keys(filter)) {
      const possibleKeys = [columnKey, db.removeKeyNumbering(columnKey)].map(
        c => c.toLowerCase()
      )
      if (!validFields.some(f => possibleKeys.includes(f.toLowerCase()))) {
        delete filter[columnKey as keyof typeof filter]
      }
    }
    if (!Object.keys(filter).length) {
      delete result[filterKey]
    }
  }

  return result
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

  const result = [
    "_id", // Querying by _id is always allowed, even if it's never part of the schema
  ]

  if (fields == null) {
    fields = Object.keys(table.schema)
  }
  result.push(...(await extractTableFields(table, fields, [table._id!])))

  return result
}
