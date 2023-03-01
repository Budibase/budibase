import { get, writable } from "svelte/store"

export const createReorderStores = context => {
  const { columns, rand, scroll, bounds } = context
  const reorderInitialState = {
    columnIdx: null,
    swapColumnIdx: null,
    breakpoints: [],
    initialMouseX: null,
  }
  const reorder = writable(reorderInitialState)

  // Callback when dragging on a colum header and starting reordering
  const startReordering = (columnIdx, e) => {
    const $columns = get(columns)
    const $bounds = get(bounds)
    const $scroll = get(scroll)

    // Generate new breakpoints for the current columns
    let breakpoints = $columns.map(col => col.left + col.width)

    // Update state
    reorder.set({
      columnIdx,
      breakpoints,
      swapColumnIdx: null,
      initialMouseX: e.clientX,
      scrollLeft: $scroll.left,
      sheetLeft: $bounds.left,
    })

    // Add listeners to handle mouse movement
    document.addEventListener("mousemove", onReorderMouseMove)
    document.addEventListener("mouseup", stopReordering)

    // Trigger a move event immediately so ensure a candidate column is chosen
    onReorderMouseMove(e)
    document.getElementById(`sheet-${rand}`).classList.add("is-reordering")
  }

  // Callback when moving the mouse when reordering columns
  const onReorderMouseMove = e => {
    const $reorder = get(reorder)
    if ($reorder.columnIdx == null) {
      return
    }

    // Compute the closest breakpoint to the current position
    let swapColumnIdx
    let minDistance = Number.MAX_SAFE_INTEGER
    const mouseX = e.clientX - $reorder.sheetLeft + $reorder.scrollLeft
    $reorder.breakpoints.forEach((point, idx) => {
      const distance = Math.abs(point - mouseX)
      if (distance < minDistance) {
        minDistance = distance
        swapColumnIdx = idx
      }
    })

    if (swapColumnIdx !== $reorder.swapColumnIdx) {
      reorder.update(state => ({
        ...state,
        swapColumnIdx: swapColumnIdx,
      }))
    }
  }

  // Callback when stopping reordering columns
  const stopReordering = () => {
    // Swap position of columns
    let { columnIdx, swapColumnIdx } = get(reorder)
    swapColumnIdx++
    columns.update(state => {
      const removed = state.splice(columnIdx, 1)
      if (--swapColumnIdx < columnIdx) {
        swapColumnIdx++
      }
      state.splice(swapColumnIdx, 0, removed[0])
      let offset = 0
      return state.map((col, idx) => {
        const newCol = {
          ...col,
          idx,
          left: offset,
        }
        offset += col.width
        return newCol
      })
    })

    // Reset state
    reorder.set(reorderInitialState)

    // Remove event handlers
    document.removeEventListener("mousemove", onReorderMouseMove)
    document.removeEventListener("mouseup", stopReordering)
    document.getElementById(`sheet-${rand}`).classList.remove("is-reordering")
  }

  return {
    reorder: {
      ...reorder,
      actions: {
        startReordering,
        stopReordering,
      },
    },
  }
}
