import { writable, get, derived } from "svelte/store"

// Normally we would break out actions into the explicit "createActions"
// function, but for validation all these actions are pure so can go into
// "createStores" instead to make dependency ordering simpler
export const createStores = () => {
  const validation = writable({})

  // Derive which rows have errors so that we can use that info later
  const rowErrorMap = derived(validation, $validation => {
    let map = {}
    Object.entries($validation).forEach(([key, error]) => {
      // Extract row ID from all errored cell IDs
      if (error) {
        map[key.split("-")[0]] = true
      }
    })
    return map
  })

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
    return get(rowErrorMap)[rowId]
  }

  return {
    validation: {
      ...validation,
      actions: {
        setError,
        rowHasErrors,
      },
    },
  }
}

export const initialise = context => {
  const { validation, previousFocusedRowId, columns, stickyColumn } = context

  // Remove validation errors from previous focused row
  previousFocusedRowId.subscribe(id => {
    if (id) {
      const $columns = get(columns)
      const $stickyColumn = get(stickyColumn)
      validation.update(state => {
        $columns.forEach(column => {
          state[`${id}-${column.name}`] = null
        })
        if ($stickyColumn) {
          state[`${id}-${$stickyColumn.name}`] = null
        }
        return state
      })
    }
  })
}
