import { writable, get } from "svelte/store"
import { parseCellID } from "../lib/utils"

export const createStores = () => {
  const menu = writable({
    left: 0,
    top: 0,
    visible: false,
    multiRowMode: false,
    multiCellMode: false,
  })
  return {
    menu,
  }
}

export const createActions = context => {
  const {
    menu,
    focusedCellId,
    gridID,
    selectedRows,
    selectedRowCount,
    selectedCellMap,
    selectedCellCount,
  } = context

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

    // Check if there are multiple rows selected, and if this is one of them
    let multiRowMode = false
    if (get(selectedRowCount) > 1) {
      const { rowId } = parseCellID(cellId)
      if (get(selectedRows)[rowId]) {
        multiRowMode = true
      }
    }

    // Check if there are multiple cells selected, and if this is one of them
    let multiCellMode = false
    if (!multiRowMode && get(selectedCellCount) > 1) {
      if (get(selectedCellMap)[cellId]) {
        multiCellMode = true
      }
    }

    // Only focus this cell if not in multi row mode
    if (!multiRowMode && !multiCellMode) {
      focusedCellId.set(cellId)
    }

    menu.set({
      left: targetBounds.left - dataBounds.left + e.offsetX,
      top: targetBounds.top - dataBounds.top + e.offsetY,
      visible: true,
      multiRowMode,
      multiCellMode,
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
