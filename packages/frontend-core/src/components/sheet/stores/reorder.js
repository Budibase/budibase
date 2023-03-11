import { get, writable, derived } from "svelte/store"

export const createReorderStores = context => {
  const { columns, scroll, bounds, stickyColumn } = context
  const reorderInitialState = {
    sourceColumn: null,
    targetColumn: null,
    breakpoints: [],
    initialMouseX: null,
    scrollLeft: 0,
    sheetLeft: 0,
  }
  const reorder = writable(reorderInitialState)
  const isReordering = derived(
    reorder,
    $reorder => !!$reorder.sourceColumn,
    false
  )

  // Callback when dragging on a colum header and starting reordering
  const startReordering = (column, e) => {
    const $columns = get(columns)
    const $bounds = get(bounds)
    const $scroll = get(scroll)
    const $stickyColumn = get(stickyColumn)

    // Generate new breakpoints for the current columns
    let breakpoints = $columns.map(col => ({
      x: col.left + col.width,
      column: col.name,
    }))
    if ($stickyColumn) {
      breakpoints.unshift({
        x: 0,
        column: $stickyColumn.name,
      })
    }

    // Update state
    reorder.set({
      sourceColumn: column,
      targetColumn: null,
      breakpoints,
      initialMouseX: e.clientX,
      scrollLeft: $scroll.left,
      sheetLeft: $bounds.left,
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

    // Compute the closest breakpoint to the current position
    let targetColumn
    let minDistance = Number.MAX_SAFE_INTEGER
    const mouseX = e.clientX - $reorder.sheetLeft + $reorder.scrollLeft
    $reorder.breakpoints.forEach(point => {
      const distance = Math.abs(point.x - mouseX)
      if (distance < minDistance) {
        minDistance = distance
        targetColumn = point.column
      }
    })

    if (targetColumn !== $reorder.targetColumn) {
      reorder.update(state => ({
        ...state,
        targetColumn,
      }))
    }
  }

  // Callback when stopping reordering columns
  const stopReordering = () => {
    // Swap position of columns
    let { sourceColumn, targetColumn } = get(reorder)
    const $columns = get(columns)
    let sourceIdx = $columns.findIndex(x => x.name === sourceColumn)
    let targetIdx = $columns.findIndex(x => x.name === targetColumn)
    targetIdx++
    columns.update(state => {
      const removed = state.splice(sourceIdx, 1)
      if (--targetIdx < sourceIdx) {
        targetIdx++
      }
      state.splice(targetIdx, 0, removed[0])
      return state.slice()
    })

    // Reset state
    reorder.set(reorderInitialState)

    // Remove event handlers
    document.removeEventListener("mousemove", onReorderMouseMove)
    document.removeEventListener("mouseup", stopReordering)
  }

  const moveColumnLeft = column => {
    const $columns = get(columns)
    const sourceIdx = $columns.findIndex(x => x.name === column)
    if (sourceIdx === 0) {
      return
    }
    columns.update(state => {
      let tmp = state[sourceIdx]
      state[sourceIdx] = state[sourceIdx - 1]
      state[sourceIdx - 1] = tmp
      return state.slice()
    })
  }

  const moveColumnRight = column => {
    const $columns = get(columns)
    const sourceIdx = $columns.findIndex(x => x.name === column)
    if (sourceIdx === $columns.length - 1) {
      return
    }
    columns.update(state => {
      let tmp = state[sourceIdx]
      state[sourceIdx] = state[sourceIdx + 1]
      state[sourceIdx + 1] = tmp
      return state.slice()
    })
  }

  return {
    reorder: {
      ...reorder,
      actions: {
        startReordering,
        stopReordering,
        moveColumnLeft,
        moveColumnRight,
      },
    },
    isReordering,
  }
}
