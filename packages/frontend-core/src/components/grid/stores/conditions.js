import { writable, get } from "svelte/store"
import { derivedMemo, QueryUtils } from "../../../utils"
import { OperatorOptions } from "@budibase/shared-core"
import { FieldType } from "@budibase/types"
import { processString, processStringSync } from "@budibase/string-templates"

export const createStores = () => {
  const cellMetadata = writable({})
  const rowMetadata = writable({})
  return {
    cellMetadata,
    rowMetadata,
  }
}

export const deriveStores = context => {
  const { columns } = context

  // Derive and memoize the cell conditions present in our columns so that we
  // only recompute condition metadata when absolutely necessary
  const cellConditions = derivedMemo(columns, $columns => {
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
    cellConditions,
  }
}

export const initialise = context => {
  const { cellMetadata, cellConditions, rowConditions, rowMetadata, rows } =
    context

  // Recompute all cell metadata if cell conditions change
  cellConditions.subscribe($conditions => {
    let metadata = {}
    if ($conditions?.length) {
      for (let row of get(rows)) {
        metadata[row._id] = evaluateCellConditions(row, $conditions)
      }
    }
    cellMetadata.set(metadata)
  })

  // Recompute all row metadata if row conditions change
  rowConditions.subscribe($conditions => {
    let metadata = {}
    if ($conditions?.length) {
      for (let row of get(rows)) {
        metadata[row._id] = evaluateRowConditions(row, $conditions)
      }
    }
    rowMetadata.set(metadata)
  })

  // Recompute metadata for specific rows when they change
  rows.subscribe($rows => {
    const $cellConditions = get(cellConditions)
    const $rowConditions = get(rowConditions)
    const processCells = $cellConditions?.length > 0
    const processRows = $rowConditions?.length > 0
    if (!processCells && !processRows) {
      return
    }
    const $cellMetadata = get(cellMetadata)
    const $rowMetadata = get(rowMetadata)
    let cellUpdates = {}
    let rowUpdates = {}
    for (let row of $rows) {
      // Process cell metadata
      if (processCells) {
        if (!row._rev || $cellMetadata[row._id]?.version !== row._rev) {
          cellUpdates[row._id] = evaluateCellConditions(row, $cellConditions)
        }
      }
      // Process row metadata
      if (processRows) {
        if (!row._rev || $rowMetadata[row._id]?.version !== row._rev) {
          rowUpdates[row._id] = evaluateRowConditions(row, $rowConditions)
        }
      }
    }
    if (Object.keys(cellUpdates).length) {
      cellMetadata.update(state => ({
        ...state,
        ...cellUpdates,
      }))
    }
    if (Object.keys(rowUpdates).length) {
      rowMetadata.update(state => ({
        ...state,
        ...rowUpdates,
      }))
    }
  })
}

// Evaluates an array of cell conditions against a certain row and returns the
// resultant metadata
const evaluateCellConditions = (row, conditions) => {
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

// Evaluates an array of row conditions against a certain row and returns the
// resultant metadata
const evaluateRowConditions = (row, conditions) => {
  let metadata = { version: row._rev }
  for (let condition of conditions) {
    try {
      const { metadataKey, metadataValue, value } = condition
      console.log("JS")
      const result = processStringSync(value, { row })
      if (result === true) {
        metadata[metadataKey] = metadataValue
      }
    } catch {
      // Swallow
    }
  }
  return metadata
}
