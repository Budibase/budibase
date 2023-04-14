import { writable, get } from "svelte/store"

export const createStores = () => {
  const copiedCell = writable(null)
  const copiedRow = writable(null)

  return {
    copiedCell,
    copiedRow,
  }
}

export const deriveStores = context => {
  const { copiedCell, copiedRow, focusedCellAPI } = context

  const copy = () => {
    copiedCell.set(get(focusedCellAPI)?.getValue())
    copiedRow.set(null)
  }

  const paste = () => {
    const $copiedCell = get(copiedCell)
    const $focusedCellAPI = get(focusedCellAPI)
    if ($copiedCell != null && $focusedCellAPI) {
      $focusedCellAPI.setValue($copiedCell)
    }
  }

  return {
    clipboard: {
      actions: {
        copy,
        paste,
      },
    },
  }
}
