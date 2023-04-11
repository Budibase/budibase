import { writable, get, derived } from "svelte/store"

export const createStores = () => {
  const validation = writable({})

  const setError = (cellId, error) => {
    if (!cellId) {
      return
    }
    validation.update(state => ({
      ...state,
      [cellId]: error,
    }))
  }

  return {
    validation: {
      ...validation,
      actions: {
        setError,
      },
    },
  }
}

export const deriveStores = context => {
  const { validation, focusedRow, columns, stickyColumn } = context
  const focusedRowId = derived(focusedRow, $focusedRow => $focusedRow?._id)

  // Store the row ID that was previously focused, so we can remove errors from
  // it when we focus a new row
  let previousFocusedRowId = null
  focusedRowId.subscribe(id => {
    // Remove validation errors from previous focused row
    if (previousFocusedRowId) {
      const $columns = get(columns)
      const $stickyColumn = get(stickyColumn)
      validation.update(state => {
        $columns.forEach(column => {
          state[`${previousFocusedRowId}-${column.name}`] = null
        })
        if ($stickyColumn) {
          state[`${previousFocusedRowId}-${$stickyColumn.name}`] = null
        }
        return state
      })
    }

    // Store row ID
    previousFocusedRowId = id
  })
}
