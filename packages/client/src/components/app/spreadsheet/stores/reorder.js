import { get, writable } from "svelte/store"

export const createReorderStores = context => {
  const { columns, rand, rows } = context
  const reorderInitialState = {
    columnIdx: null,
    swapColumnIdx: null,
    breakpoints: [],
    initialMouseX: null,
  }
  const reorder = writable(reorderInitialState)

  // This is broken into its own store as it is rapidly updated, and we want to
  // ensure good performance by avoiding updating other components which depend
  // on other reordering state
  const placeholderInitialState = {
    x: null,
    initialX: null,
    width: null,
    height: null,
  }
  const placeholder = writable(placeholderInitialState)

  // Callback when dragging on a colum header and starting reordering
  const startReordering = (columnIdx, e) => {
    // Generate new breakpoints for the current columns
    let breakpoints = []
    const cols = get(columns)
    cols.forEach((col, idx) => {
      breakpoints.push(col.left)
      if (idx === cols.length - 1) {
        breakpoints.push(col.left + col.width)
      }
    })
    console.log(breakpoints, e.clientX)

    // Get bounds of the selected header and sheet body

    const self = cols[columnIdx]
    const body = document.getElementById(`sheet-${rand}-body`)
    const bodyBounds = body.getBoundingClientRect()

    // Update state
    reorder.set({
      columnIdx,
      breakpoints,
      swapColumnIdx: null,
      initialMouseX: e.clientX,
    })
    placeholder.set({
      initialX: self.left - bodyBounds.x,
      x: self.left - bodyBounds.x,
      width: self.width,
      height: (get(rows).length + 2) * 32,
    })

    // Add listeners to handle mouse movement
    document.addEventListener("mousemove", onReorderMouseMove)
    document.addEventListener("mouseup", stopReordering)

    // Trigger a move event immediately so ensure a candidate column is chosen
    onReorderMouseMove(e)
  }

  // Callback when moving the mouse when reordering columns
  const onReorderMouseMove = e => {
    const $reorder = get(reorder)
    if ($reorder.columnIdx == null) {
      return
    }

    // Compute new placeholder position
    const $placeholder = get(placeholder)
    let newX = e.clientX - $reorder.initialMouseX + $placeholder.initialX
    newX = Math.max(0, newX)

    // Compute the closest breakpoint to the current position
    let swapColumnIdx
    let minDistance = Number.MAX_SAFE_INTEGER
    $reorder.breakpoints.forEach((point, idx) => {
      const distance = Math.abs(point - e.clientX)
      if (distance < minDistance) {
        minDistance = distance
        swapColumnIdx = idx
      }
    })

    // Update state
    placeholder.update(state => {
      state.x = newX
      return state
    })
    if (swapColumnIdx !== $reorder.swapColumnIdx) {
      reorder.update(state => {
        state.swapColumnIdx = swapColumnIdx
        return state
      })
    }
  }

  // Callback when stopping reordering columns
  const stopReordering = () => {
    // Swap position of columns
    let { columnIdx, swapColumnIdx } = get(reorder)
    columns.update(state => {
      const removed = state.splice(columnIdx, 1)
      if (--swapColumnIdx < columnIdx) {
        swapColumnIdx++
      }
      state.splice(swapColumnIdx, 0, removed[0])
      state = state.map((col, idx) => ({ ...col, idx }))
      return state
    })

    // Reset state
    reorder.set(reorderInitialState)
    placeholder.set(placeholderInitialState)

    // Remove event handlers
    document.removeEventListener("mousemove", onReorderMouseMove)
    document.removeEventListener("mouseup", stopReordering)
  }

  return {
    reorder: {
      ...reorder,
      actions: {
        startReordering,
        stopReordering,
      },
    },
    reorderPlaceholder: placeholder,
  }
}
