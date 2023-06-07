import { writable, get } from "svelte/store"

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
