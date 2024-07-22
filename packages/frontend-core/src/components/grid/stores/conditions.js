import { writable, get } from "svelte/store"
import { derivedMemo, QueryUtils } from "../../../utils"
import { FieldType, EmptyFilterOption } from "@budibase/types"

export const createStores = () => {
  const metadata = writable({})
  return {
    metadata,
  }
}

export const deriveStores = context => {
  const { columns } = context

  // Derive and memoize the cell conditions present in our columns so that we
  // only recompute condition metadata when absolutely necessary
  const conditions = derivedMemo(columns, $columns => {
    let newConditions = []
    for (let column of $columns) {
      for (let condition of column.conditions || []) {
        newConditions.push({
          ...condition,
          column: column.name,
          type: column.schema.type,
        })
      }
    }
    return newConditions
  })

  return {
    conditions,
  }
}

export const initialise = context => {
  const { metadata, conditions, rows } = context

  // Recompute all metadata if conditions change
  conditions.subscribe($conditions => {
    let newMetadata = {}
    if ($conditions?.length) {
      for (let row of get(rows)) {
        newMetadata[row._id] = evaluateConditions(row, $conditions)
      }
    }
    metadata.set(newMetadata)
  })

  // Recompute metadata for specific rows when they change
  rows.subscribe($rows => {
    const $conditions = get(conditions)
    if (!$conditions?.length) {
      return
    }
    const $metadata = get(metadata)
    let metadataUpdates = {}
    for (let row of $rows) {
      if (!row._rev || $metadata[row._id]?.version !== row._rev) {
        metadataUpdates[row._id] = evaluateConditions(row, $conditions)
      }
    }
    if (Object.keys(metadataUpdates).length) {
      metadata.update(state => ({
        ...state,
        ...metadataUpdates,
      }))
    }
  })
}

const TypeCoercionMap = {
  [FieldType.NUMBER]: parseFloat,
  [FieldType.DATETIME]: val => {
    if (val) {
      return new Date(val).toISOString()
    }
    return null
  },
  [FieldType.BOOLEAN]: val => {
    if (`${val}`.toLowerCase().trim() === "true") {
      return true
    }
    if (`${val}`.toLowerCase().trim() === "false") {
      return false
    }
    return null
  },
}

// Evaluates an array of cell conditions against a certain row and returns the
// resultant metadata
const evaluateConditions = (row, conditions) => {
  let metadata = {
    version: row._rev,
    row: {},
    cell: {},
  }
  for (let condition of conditions) {
    try {
      let {
        column,
        type,
        referenceValue,
        operator,
        metadataKey,
        metadataValue,
        target,
      } = condition
      let value = row[column]

      // Coerce values into correct types for primitives
      let coercedType = type
      if (type === FieldType.FORMULA) {
        // For formulas we want to ensure that the reference type matches the
        // real type
        if (value === true || value === false) {
          coercedType = FieldType.BOOLEAN
        } else if (typeof value === "number") {
          coercedType = FieldType.NUMBER
        }
      }
      const coerce = TypeCoercionMap[coercedType]
      if (coerce) {
        value = coerce(value)
        referenceValue = coerce(referenceValue)
      }

      // Build lucene compatible condition expression
      const luceneFilter = {
        operator,
        type,
        field: "value",
        value: referenceValue,
      }
      let query = QueryUtils.buildQuery([luceneFilter])
      query.onEmptyFilter = EmptyFilterOption.RETURN_NONE
      const result = QueryUtils.runQuery([{ value }], query)
      if (result.length > 0) {
        if (target === "row") {
          metadata.row = {
            ...metadata.row,
            [metadataKey]: metadataValue,
          }
        } else {
          metadata.cell[column] = {
            ...metadata.cell[column],
            [metadataKey]: metadataValue,
          }
        }
      }
    } catch {
      // Swallow
    }
  }
  return metadata
}
