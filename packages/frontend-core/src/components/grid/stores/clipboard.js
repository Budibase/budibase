import { writable, get } from "svelte/store"

export const createStores = () => {
  const copiedCell = writable(null)

  return {
    copiedCell,
  }
}

export const deriveStores = context => {
  const { copiedCell, focusedCellAPI } = context

  const copy = () => {
    copiedCell.set(get(focusedCellAPI)?.getValue())
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
