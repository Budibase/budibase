import { derived, writable, get } from "svelte/store"
import { Helpers } from "@budibase/bbui"

export const createStores = () => {
  const clipboard = writable({
    value: null,
    multiCellMode: false,
  })

  return {
    clipboard,
  }
}

export const deriveStores = context => {
  const { clipboard, focusedCellAPI, selectedCellCount } = context

  const copyAllowed = derived(focusedCellAPI, $focusedCellAPI => {
    return $focusedCellAPI != null
  })

  const pasteAllowed = derived(
    [clipboard, focusedCellAPI, selectedCellCount],
    ([$clipboard, $focusedCellAPI, $selectedCellCount]) => {
      if ($clipboard.value == null || !$focusedCellAPI) {
        return false
      }
      // Prevent pasting into a single cell, if we have a single cell value and
      // this cell is readonly
      const multiCellPaste = $selectedCellCount > 1
      if (
        !$clipboard.multiCellMode &&
        !multiCellPaste &&
        $focusedCellAPI.isReadonly()
      ) {
        return false
      }
      return true
    }
  )

  return {
    copyAllowed,
    pasteAllowed,
  }
}

export const createActions = context => {
  const {
    clipboard,
    selectedCellCount,
    focusedCellAPI,
    copyAllowed,
    pasteAllowed,
  } = context

  const copy = () => {
    if (!get(copyAllowed)) {
      return
    }
    const $selectedCellCount = get(selectedCellCount)
    const $focusedCellAPI = get(focusedCellAPI)
    const multiCellMode = $selectedCellCount > 1

    // Multiple values to copy
    if (multiCellMode) {
      // TODO
      return
    }

    // Single value to copy
    const value = $focusedCellAPI.getValue()
    clipboard.set({
      value,
      multiCellMode,
    })

    // Also copy a stringified version to the clipboard
    let stringified = ""
    if (value != null && value !== "") {
      // Only conditionally stringify to avoid redundant quotes around text
      stringified = typeof value === "object" ? JSON.stringify(value) : value
    }
    Helpers.copyToClipboard(stringified)
  }

  const paste = () => {
    if (!get(pasteAllowed)) {
      return
    }
    const $clipboard = get(clipboard)
    const $focusedCellAPI = get(focusedCellAPI)
    if ($clipboard.value == null || !$focusedCellAPI) {
      return
    }

    // Check if we're pasting into one or more cells
    const $selectedCellCount = get(selectedCellCount)
    const multiCellPaste = $selectedCellCount > 1

    if ($clipboard.multiCellMode) {
      if (multiCellPaste) {
        // Multi to multi (only paste selected cells)
      } else {
        // Multi to single (expand to paste all values)
      }
    } else {
      if (multiCellPaste) {
        // Single to multi (duplicate value in all selected cells)
      } else {
        // Single to single
        $focusedCellAPI.setValue($clipboard.value)
      }
    }
  }

  return {
    clipboard: {
      ...clipboard,
      actions: {
        copy,
        paste,
      },
    },
  }
}
