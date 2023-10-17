import { writable, get } from "svelte/store"
import { Helpers } from "@budibase/bbui"

export const createStores = () => {
  const copiedCell = writable(null)

  return {
    copiedCell,
  }
}

export const createActions = context => {
  const { copiedCell, focusedCellAPI } = context

  const copy = () => {
    const value = get(focusedCellAPI)?.getValue()
    copiedCell.set(value)

    // Also copy a stringified version to the clipboard
    let stringified = ""
    if (value != null && value !== "") {
      // Only conditionally stringify to avoid redundant quotes around text
      stringified = typeof value === "object" ? JSON.stringify(value) : value
    }
    Helpers.copyToClipboard(stringified)
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
