import { writable, get, derived } from "svelte/store"
import { parseCellID } from "../lib/utils"

// Normally we would break out actions into the explicit "createActions"
// function, but for validation all these actions are pure so can go into
// "createStores" instead to make dependency ordering simpler
export const createStores = () => {
  const validation = writable({})

  return {
    validation,
  }
}

export const deriveStores = context => {
  const { validation } = context

  // Derive which rows have errors so that we can use that info later
  const validationRowLookupMap = derived(validation, $validation => {
    let map = {}
    Object.entries($validation).forEach(([key, error]) => {
      // Extract row ID from all errored cell IDs
      if (error) {
        const { rowId } = parseCellID(key)
        if (!map[rowId]) {
          map[rowId] = []
        }
        map[rowId].push(key)
      }
    })
    return map
  })

  return {
    validationRowLookupMap,
  }
}

export const createActions = context => {
  const { validation, focusedCellId, validationRowLookupMap } = context

  const setError = (cellId, error) => {
    if (!cellId) {
      return
    }
    validation.update(state => ({
      ...state,
      [cellId]: error,
    }))
  }

  const rowHasErrors = rowId => {
    return get(validationRowLookupMap)[rowId]?.length > 0
  }

  const focusFirstRowError = rowId => {
    const errorCells = get(validationRowLookupMap)[rowId]
    const cellId = errorCells?.[0]
    if (cellId) {
      focusedCellId.set(cellId)
    }
  }

  return {
    validation: {
      ...validation,
      actions: {
        setError,
        rowHasErrors,
        focusFirstRowError,
      },
    },
  }
}

export const initialise = context => {
  const { validation, previousFocusedRowId, validationRowLookupMap } = context

  // Remove validation errors when changing rows
  previousFocusedRowId.subscribe(id => {
    if (id) {
      const errorCells = get(validationRowLookupMap)[id]
      if (errorCells?.length) {
        validation.update(state => {
          for (let cellId of errorCells) {
            delete state[cellId]
          }
          return state
        })
      }
    }
  })
}
