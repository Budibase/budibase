import { writable, get } from "svelte/store"
import { GutterWidth } from "../lib/constants"

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

export const deriveStores = context => {
  const { menu, bounds, focusedCellId, stickyColumn, rowHeight } = context

  const open = (cellId, e) => {
    const $bounds = get(bounds)
    const $stickyColumn = get(stickyColumn)
    const $rowHeight = get(rowHeight)
    e.preventDefault()
    focusedCellId.set(cellId)
    menu.set({
      left:
        e.clientX - $bounds.left + GutterWidth + ($stickyColumn?.width || 0),
      top: e.clientY - $bounds.top + $rowHeight,
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
