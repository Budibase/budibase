import { writable, get, derived, Writable, Readable } from "svelte/store"
import { derivedMemo, QueryUtils } from "../../../utils"
import {
  FieldType,
  EmptyFilterOption,
  UIRow,
  UICondition,
  EXTERNAL_ROW_REV,
} from "@budibase/types"
import { Store as StoreContext } from "."

interface ConditionStore {
  metadata: Writable<Record<string, any>>
}

interface ConditionDerivedStore {
  conditions: Readable<UICondition[]>
}

export type Store = ConditionStore & ConditionDerivedStore

export const createStores = (): ConditionStore => {
  const metadata = writable({})
  return {
    metadata,
  }
}

export const deriveStores = (context: StoreContext): ConditionDerivedStore => {
  const { columns, props } = context

  // Derive and memoize the cell conditions present in our columns so that we
  // only recompute condition metadata when absolutely necessary
  const conditions = derivedMemo(
    derived([columns, props], ([$columns, $props]) => {
      let newConditions: UICondition[] = []

      // Add column conditions
      for (let column of $columns) {
        for (let condition of column.conditions || []) {
          newConditions.push({
            ...condition,
            column: column.name,
            type: column.schema.type,
          })
        }
      }

      // Add button conditions
      if ($props.buttons) {
        for (let button of $props.buttons) {
          for (let condition of button.conditions || []) {
            newConditions.push({
              ...condition,
              target: "button",
              buttonIndex: $props.buttons.indexOf(button),
            })
          }
        }
      }

      return newConditions
    }),
    conditions => conditions
  )

  return {
    conditions,
  }
}

export const initialise = (context: StoreContext) => {
  const { metadata, conditions, rows } = context

  // Recompute all metadata if conditions change
  conditions.subscribe($conditions => {
    let newMetadata: Record<string, any> = {}
    if ($conditions?.length) {
      for (let row of get(rows)) {
        newMetadata[row._id] = evaluateConditions(row, $conditions, context)
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
    let metadataUpdates: Record<string, any> = {}
    for (let row of $rows) {
      const meta = $metadata[row._id]
      const changed =
        // No _rev indicates a new row
        !row._rev ||
        // _rev changed since last evaluation
        (meta && meta.version !== row._rev) ||
        // this is an external row, we have no way to know if it has changed, so
        // we always re-evaluate
        row._rev === EXTERNAL_ROW_REV
      if (!changed && meta) {
        continue
      }

      $metadata[row._id] = evaluateConditions(row, $conditions, context)
    }
    if (Object.keys(metadataUpdates).length) {
      metadata.update(state => ({
        ...state,
        ...metadataUpdates,
      }))
    }
  })
}

const TypeCoercionMap: Partial<Record<FieldType, (val: string) => any>> = {
  [FieldType.NUMBER]: parseFloat,
  [FieldType.DATETIME]: (val: string) => {
    if (val) {
      return new Date(val).toISOString()
    }
    return null
  },
  [FieldType.BOOLEAN]: (val: string) => {
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
const evaluateConditions = (
  row: UIRow,
  conditions: UICondition[],
  context: StoreContext
) => {
  const metadata: {
    version?: string
    row: Record<string, string>
    cell: Record<string, any>
    button: Record<string, any>
  } = {
    version: row._rev,
    row: {},
    cell: {},
    button: {},
  }

  // Get dynamic button conditions
  const { props } = context
  const $props = get(props)
  let allConditions = [...conditions]

  // Add dynamic button conditions from getRowConditions
  if ($props.buttons) {
    for (let button of $props.buttons) {
      if (button.getRowConditions) {
        const dynamicConditions = button.getRowConditions(row) || []
        for (let condition of dynamicConditions) {
          allConditions.push({
            ...condition,
            target: "button",
            buttonIndex: $props.buttons.indexOf(button),
          })
        }
      }
    }
  }

  // Pre-process button conditions to set default visibility for show conditions
  const buttonShowConditions = new Set()
  for (let condition of allConditions) {
    if (
      condition.target === "button" &&
      condition.action === "show" &&
      typeof condition.buttonIndex === "number"
    ) {
      buttonShowConditions.add(condition.buttonIndex)
      // Initialize button metadata and set as hidden by default for show conditions
      if (!metadata.button[condition.buttonIndex]) {
        metadata.button[condition.buttonIndex] = {}
      }
      metadata.button[condition.buttonIndex].hidden = true
    }
  }

  for (let condition of allConditions) {
    try {
      let {
        column,
        type,
        referenceValue,
        operator,
        metadataKey,
        metadataValue,
        target,
        buttonIndex,
        newValue,
        action,
        setting,
        settingValue,
      } = condition

      let value
      if (target === "button") {
        value = newValue
      } else {
        value = row[column]
      }

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
        value = coerce(value as string)
        referenceValue = coerce(referenceValue as string)
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
        if (target === "button" && typeof buttonIndex === "number") {
          if (!metadata.button[buttonIndex]) {
            metadata.button[buttonIndex] = {}
          }

          if (action === "hide") {
            metadata.button[buttonIndex].hidden = true
          } else if (action === "show") {
            metadata.button[buttonIndex].hidden = false
          } else if (action === "update" && setting) {
            metadata.button[buttonIndex][setting] = settingValue
          }
        } else if (target === "row") {
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
