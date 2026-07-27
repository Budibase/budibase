import { db, HTTPError } from "@budibase/backend-core"
import {
  FieldType,
  isArraySearchOperator,
  isBasicSearchOperator,
  isLogicalSearchOperator,
  isRangeSearchOperator,
  SearchFilters,
  Table,
} from "@budibase/types"
import sdk from "../.."
import { isInternal } from "../tables/utils"

const ALLOWED_FILTER_META_KEYS: (keyof SearchFilters)[] = [
  "allOr",
  "fuzzyOr",
  "onEmptyFilter",
  "documentType",
]

const isAllowedFilterKey = (key: string): boolean =>
  ALLOWED_FILTER_META_KEYS.includes(key as keyof SearchFilters) ||
  isBasicSearchOperator(key) ||
  isArraySearchOperator(key) ||
  isRangeSearchOperator(key) ||
  isLogicalSearchOperator(key)

type InvalidFilterHandler = (kind: "operator" | "field", key: string) => void

// Walks the filter tree, calling `onInvalid` for each invalid operator or
// field reference - throw from it to abort the walk. `validFields` must
// already be lowercased.
const walkFilters = (
  filters: SearchFilters,
  validFields: string[],
  onInvalid: InvalidFilterHandler
): void => {
  for (const key of Object.keys(filters || {}) as (keyof SearchFilters)[]) {
    if (!isAllowedFilterKey(key)) {
      onInvalid("operator", key)
      continue
    }

    if (ALLOWED_FILTER_META_KEYS.includes(key)) {
      continue
    }

    if (isLogicalSearchOperator(key)) {
      const filter = filters[key]
      if (!filter) {
        continue
      }
      for (const condition of filter.conditions) {
        walkFilters(condition, validFields, onInvalid)
      }
    } else {
      const filter = filters[key]
      if (!filter || typeof filter !== "object") {
        continue
      }

      for (const field of Object.keys(filter)) {
        if (
          !validFields.includes(field.toLowerCase()) &&
          !validFields.includes(db.removeKeyNumbering(field).toLowerCase())
        ) {
          onInvalid("field", field)
        }
      }
    }
  }
}

export const validateFilters = (
  filters: SearchFilters,
  validFields: string[]
) => {
  walkFilters(
    filters,
    validFields.map(f => f.toLowerCase()),
    (kind, key) => {
      throw new HTTPError(`Invalid filter ${kind}: ${key}`, 400)
    }
  )
}

// Unlike validateFilters, this doesn't error on filter fields that aren't part
// of the schema - it collects them. Saved view queries can reference columns
// that have since been deleted from the table; searches against those views
// must fail closed rather than reach the SQL layer, where external datasources
// error on the unknown column.
export const findInvalidFilterFields = (
  filters: SearchFilters,
  validFields: string[]
): string[] => {
  const invalid: string[] = []
  walkFilters(
    filters,
    validFields.map(f => f.toLowerCase()),
    (kind, key) => {
      if (kind === "field") {
        invalid.push(key)
      }
    }
  )
  return invalid
}

export const getQueryableFields = async (
  table: Table,
  fields?: string[],
  opts?: { includeHidden?: boolean }
): Promise<string[]> => {
  const extractTableFields = async (
    table: Table,
    allowedFields: string[],
    fromTables: string[],
    extractOpts?: { noRelationships?: boolean }
  ): Promise<string[]> => {
    const result = []
    if (isInternal({ table })) {
      result.push("_id")
    }

    for (const field of Object.keys(table.schema).filter(
      f =>
        allowedFields.includes(f) &&
        (opts?.includeHidden || table.schema[f].visible !== false)
    )) {
      const subSchema = table.schema[field]
      const isRelationship = subSchema.type === FieldType.LINK
      // avoid relationship loops
      if (
        isRelationship &&
        (extractOpts?.noRelationships || fromTables.includes(subSchema.tableId))
      ) {
        continue
      }
      if (isRelationship) {
        result.push(field)
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
