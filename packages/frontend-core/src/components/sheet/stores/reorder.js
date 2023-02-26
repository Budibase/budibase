import { get, writable } from "svelte/store"

export const createReorderStores = context => {
  const { columns, bounds, rows, scroll, rand } = context
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
    const $columns = get(columns)
    const $bounds = get(bounds)
    const $rows = get(rows)
    const $scroll = get(scroll)

    // Generate new breakpoints for the current columns
    let breakpoints = []
    $columns.forEach((col, idx) => {
      breakpoints.push(col.left)
      if (idx === $columns.length - 1) {
        breakpoints.push(col.left + col.width)
      }
    })
    const self = $columns[columnIdx]

    // Update state
    reorder.set({
      columnIdx,
      breakpoints,
      swapColumnIdx: null,
      initialMouseX: e.clientX,
    })
    placeholder.set({
      initialX: self.left,
      x: self.left,
      width: self.width,
      height: ($rows.length + 2) * 32,
      sheetLeft: $bounds.left,
      maxX: $bounds.width - self.width,
      scrollLeft: $scroll.left,
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

    // Compute new placeholder position
    const $placeholder = get(placeholder)
    let newX =
      e.clientX -
      $reorder.initialMouseX +
      $placeholder.initialX -
      $placeholder.scrollLeft
    newX = Math.max(0, newX)
    newX = Math.min($placeholder.maxX, newX)

    // Compute the closest breakpoint to the current position
    let swapColumnIdx
    let minDistance = Number.MAX_SAFE_INTEGER
    $reorder.breakpoints.forEach((point, idx) => {
      const distance = Math.abs(
        point - e.clientX + $placeholder.sheetLeft - $placeholder.scrollLeft
      )
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
      let offset = 40
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
    placeholder.set(placeholderInitialState)

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
    reorderPlaceholder: placeholder,
  }
}
