import { derived, get, writable } from "svelte/store"

export const createSheetAPIStores = context => {
  const { focusedCellId } = context
  const cellAPIs = writable({})

  const registerCellAPI = (cellId, api) => {
    // Ignore registration if cell is not selected
    const [rowId, column] = cellId.split("-")
    if (rowId !== "new" && !get(focusedCellId)?.startsWith(rowId)) {
      return
    }

    // Store API
    cellAPIs.update(state => ({
      ...state,
      [column]: api,
    }))
  }

  const getCellAPI = column => {
    return get(cellAPIs)[column]
  }

  // Derive the selected cell API
  const selectedCellAPI = derived(
    [cellAPIs, focusedCellId],
    ([$apis, $focusedCellId]) => {
      if (!$focusedCellId) {
        return null
      }
      const [, column] = $focusedCellId.split("-")
      return $apis[column]
    },
    null
  )

  const focusedRowAPI = derived(cellAPIs, $apis => {
    return {
      validate: () => {
        let errors = null
        for (let [column, api] of Object.entries($apis || {})) {
          const error = api.validate()
          if (error) {
            errors = {
              ...errors,
              [column]: error,
            }
          }
        }
        return errors
      },
    }
  })

  return {
    selectedCellAPI,
    focusedRowAPI,
    sheetAPI: {
      actions: {
        registerCellAPI,
        getCellAPI,
      },
    },
  }
}
