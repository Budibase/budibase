import { writable, get } from "svelte/store"

const MinColumnWidth = 100

export const createResizeStore = context => {
  const { columns } = context
  const initialState = {
    initialMouseX: null,
    initialWidth: null,
    columnIdx: null,
  }
  const resize = writable(initialState)

  const startResizing = (columnIdx, e) => {
    // Prevent propagation to stop reordering triggering
    e.stopPropagation()

    // Update state
    resize.set({
      columnIdx,
      initialWidth: get(columns)[columnIdx].width,
      initialMouseX: e.clientX,
    })

    // Add mouse event listeners to handle resizing
    document.addEventListener("mousemove", onResizeMouseMove)
    document.addEventListener("mouseup", stopResizing)
  }

  const onResizeMouseMove = e => {
    const $resize = get(resize)
    const dx = e.clientX - $resize.initialMouseX
    const width = get(columns)[$resize.columnIdx].width
    const newWidth = Math.max(MinColumnWidth, $resize.initialWidth + dx)

    // Skip small updates
    if (Math.abs(width - newWidth) < 10) {
      return
    }

    // Update width of column
    columns.update(state => {
      state[$resize.columnIdx].width = newWidth
      return state
    })
  }

  const stopResizing = () => {
    resize.set(initialState)
    document.removeEventListener("mousemove", onResizeMouseMove)
    document.removeEventListener("mouseup", stopResizing)
  }

  return {
    ...resize,
    actions: {
      startResizing,
    },
  }
}
