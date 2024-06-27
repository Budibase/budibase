import { writable, get } from "svelte/store"
import { derivedMemo, QueryUtils } from "../../../utils"

export const createStores = () => {
  const conditionMetadata = writable({})
  return {
    conditionMetadata,
  }
}

export const deriveStores = context => {
  const { columns } = context

  // Derive and memoize the conditions present in our columns so that we only
  // recompute condition metdata when absolutely necessary
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
  const { conditionMetadata, conditions, rows } = context

  // Evaluates an array of conditions against a certain row and returns the
  // resultant metadata
  const evaluateConditions = (row, conditions) => {
    let metadata = { version: row._rev }
    for (let condition of conditions) {
      try {
        let {
          column,
          type,
          referenceValue,
          operator,
          metadataKey,
          metadataValue,
        } = condition
        let value = row[column]

        // Coerce values into correct types for primitives
        if (type === "number") {
          referenceValue = parseFloat(referenceValue)
          value = parseFloat(value)
        } else if (type === "datetime") {
          if (referenceValue) {
            referenceValue = new Date(referenceValue).toISOString()
          }
          if (value) {
            value = new Date(value).toISOString()
          }
        } else if (type === "boolean") {
          referenceValue = `${referenceValue}`.toLowerCase() === "true"
          value = `${value}`.toLowerCase() === "true"
        }

        // Build lucene compatible condition expression
        const luceneFilter = {
          operator,
          type,
          field: "value",
          value: referenceValue,
        }
        const query = QueryUtils.buildQuery([luceneFilter])
        const result = QueryUtils.runQuery([{ value }], query)
        if (result.length > 0) {
          if (!metadata[column]) {
            metadata[column] = {}
          }
          metadata[column][metadataKey] = metadataValue
        }
      } catch {
        // Swallow
      }
    }
    return metadata
  }

  // Recompute all metadata if conditions change
  conditions.subscribe($conditions => {
    console.log($conditions)
    console.log("recomputing all conditions")
    let metadata = {}
    if ($conditions.length) {
      for (let row of get(rows)) {
        metadata[row._id] = evaluateConditions(row, $conditions)
      }
    }
    conditionMetadata.set(metadata)
  })

  // Recompute specific rows when they change
  rows.subscribe($rows => {
    const $conditions = get(conditions)
    if (!$conditions.length) {
      return
    }
    const metadata = get(conditionMetadata)
    let updates = {}
    for (let row of $rows) {
      if (!row._rev || metadata[row._id]?.version !== row._rev) {
        console.log("recompute row", row._id)
        updates[row._id] = evaluateConditions(row, $conditions)
      }
    }
    if (Object.keys(updates).length) {
      conditionMetadata.update(state => ({
        ...state,
        ...updates,
      }))
    }
  })
}
