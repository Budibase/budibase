import { writable, get } from "svelte/store"
import { parseCellID } from "../lib/utils"

export const createStores = () => {
  const menu = writable({
    x: 0,
    y: 0,
    visible: false,
    selectedRow: null,
  })
  return {
    menu,
  }
}

export const createActions = context => {
  const { menu, focusedCellId, gridID, selectedRows, selectedRowCount } =
    context

  const open = (cellId, e) => {
    e.preventDefault()
    e.stopPropagation()

    // Get DOM node for grid data wrapper to compute relative position to
    const gridNode = document.getElementById(gridID)
    const dataNode = gridNode?.getElementsByClassName("grid-data-outer")?.[0]
    if (!dataNode) {
      return
    }

    // Compute bounds of cell relative to outer data node
    const targetBounds = e.target.getBoundingClientRect()
    const dataBounds = dataNode.getBoundingClientRect()

    // Check if there are multiple rows selected, and this is one of them
    let multiRowMode = false
    if (get(selectedRowCount) > 1) {
      const rowId = parseCellID(cellId).id
      if (get(selectedRows)[rowId]) {
        multiRowMode = true
      }
    }

    // Only focus this cell if not in multi row mode
    if (!multiRowMode) {
      focusedCellId.set(cellId)
    }

    menu.set({
      left: targetBounds.left - dataBounds.left + e.offsetX,
      top: targetBounds.top - dataBounds.top + e.offsetY,
      visible: true,
      multiRowMode,
    })
  }

  const close = () => {
    menu.update(state => ({
      ...state,
      visible: false,
    }))
  }

  return {
    menu: {
      ...menu,
      actions: {
        open,
        close,
      },
    },
  }
}
