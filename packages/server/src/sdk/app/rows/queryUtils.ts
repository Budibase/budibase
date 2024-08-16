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
  for (const filterKey of Object.keys(result) as (keyof SearchFilters)[]) {
    if (typeof result[filterKey] !== "object") {
      continue
    }
    if (isLogicalSearchOperator(filterKey)) {
      const resultingConditions: SearchFilters[] = []
      for (const condition of result[filterKey].conditions) {
        const resultingCondition = removeInvalidFilters(condition, validFields)
        if (Object.keys(resultingCondition).length) {
          resultingConditions.push(resultingCondition)
        }
      }
      if (resultingConditions.length) {
        result[filterKey].conditions = resultingConditions
      } else {
        delete result[filterKey]
      }
      continue
    }

    const filter = result[filterKey]
    for (const columnKey of Object.keys(filter)) {
      const possibleKeys = [columnKey, db.removeKeyNumbering(columnKey)].map(
        c => c.toLowerCase()
      )
      if (!validFields.some(f => possibleKeys.includes(f.toLowerCase()))) {
        delete filter[columnKey]
      }
    }
    if (!Object.keys(filter).length) {
      delete result[filterKey]
    }
  }

  return result
}

export const getQueryableFields = async (
  fields: string[],
  table: Table
): Promise<string[]> => {
  const extractTableFields = async (
    table: Table,
    allowedFields: string[],
    fromTables: string[]
  ): Promise<string[]> => {
    const result = []
    for (const field of Object.keys(table.schema).filter(
      f => allowedFields.includes(f) && table.schema[f].visible !== false
    )) {
      const subSchema = table.schema[field]
      if (subSchema.type === FieldType.LINK) {
        if (fromTables.includes(subSchema.tableId)) {
          // avoid circular loops
          continue
        }
        const relatedTable = await sdk.tables.getTable(subSchema.tableId)
        const relatedFields = await extractTableFields(
          relatedTable,
          Object.keys(relatedTable.schema),
          [...fromTables, subSchema.tableId]
        )

        result.push(
          ...relatedFields.flatMap(f => [
            `${subSchema.name}.${f}`,
            // should be able to filter by relationship using table name
            `${relatedTable.name}.${f}`,
          ])
        )
      } else {
        result.push(field)
      }
    }
    return result
  }

  const result = [
    "_id", // Querying by _id is always allowed, even if it's never part of the schema
  ]

  result.push(...(await extractTableFields(table, fields, [table._id!])))

  return result
}
