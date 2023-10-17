import { writable } from "svelte/store"

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
  const { menu, focusedCellId, rand } = context

  const open = (cellId, e) => {
    e.preventDefault()

    // Get DOM node for grid data wrapper to compute relative position to
    const gridNode = document.getElementById(`grid-${rand}`)
    const dataNode = gridNode?.getElementsByClassName("grid-data-outer")?.[0]
    if (!dataNode) {
      return
    }

    // Compute bounds of cell relative to outer data node
    const targetBounds = e.target.getBoundingClientRect()
    const dataBounds = dataNode.getBoundingClientRect()
    focusedCellId.set(cellId)
    menu.set({
      left: targetBounds.left - dataBounds.left + e.offsetX,
      top: targetBounds.top - dataBounds.top + e.offsetY,
      visible: true,
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
