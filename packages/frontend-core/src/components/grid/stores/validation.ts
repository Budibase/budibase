import { writable, get, derived, Writable, Readable } from "svelte/store"
import { Store as StoreContext } from "."
import { parseCellID } from "../lib/utils"

interface ValidationStore {
  validation: Writable<Record<string, string>>
}

interface DerivedValidationStore {
  validationRowLookupMap: Readable<Record<string, string[]>>
}

interface ValidationActions {
  validation: ValidationStore["validation"] & {
    actions: {
      setError: (cellId: string | undefined, error: string) => void
      rowHasErrors: (rowId: string) => boolean
      focusFirstRowError: (rowId: string) => void
    }
  }
}

export type Store = ValidationStore & DerivedValidationStore & ValidationActions

// Normally we would break out actions into the explicit "createActions"
// function, but for validation all these actions are pure so can go into
// "createStores" instead to make dependency ordering simpler
export const createStores = (): ValidationStore => {
  const validation = writable({})

  return {
    validation,
  }
}

export const deriveStores = (context: StoreContext): DerivedValidationStore => {
  const { validation } = context

  // Derive which rows have errors so that we can use that info later
  const validationRowLookupMap = derived(validation, $validation => {
    const map: Record<string, string[]> = {}
    Object.entries($validation).forEach(([key, error]) => {
      // Extract row ID from all errored cell IDs
      if (error) {
        const { rowId } = parseCellID(key)
        if (rowId !== undefined) {
          if (!map[rowId]) {
            map[rowId] = []
          }
          map[rowId].push(key)
        }
      }
    })
    return map
  })

  return {
    validationRowLookupMap,
  }
}

export const createActions = (context: StoreContext): ValidationActions => {
  const { validation, focusedCellId, validationRowLookupMap } = context

  const setError = (cellId: string | undefined, error: string) => {
    if (!cellId) {
      return
    }
    validation.update(state => ({
      ...state,
      [cellId]: error,
    }))
  }

  const rowHasErrors = (rowId: string) => {
    return get(validationRowLookupMap)[rowId]?.length > 0
  }

  const focusFirstRowError = (rowId: string) => {
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

export const initialise = (context: StoreContext) => {
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
