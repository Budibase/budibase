import { get, writable, derived } from "svelte/store"

const reorderInitialState = {
  sourceColumn: null,
  targetColumn: null,
  breakpoints: [],
  gridLeft: 0,
  width: 0,
  latestX: 0,
  increment: 0,
}

export const createStores = () => {
  const reorder = writable(reorderInitialState)
  const isReordering = derived(
    reorder,
    $reorder => !!$reorder.sourceColumn,
    false
  )
  return {
    reorder,
    isReordering,
  }
}

export const createActions = context => {
  const {
    reorder,
    columns,
    visibleColumns,
    scroll,
    bounds,
    stickyColumn,
    ui,
    maxScrollLeft,
  } = context

  let autoScrollInterval
  let isAutoScrolling

  // Callback when dragging on a colum header and starting reordering
  const startReordering = (column, e) => {
    const $visibleColumns = get(visibleColumns)
    const $bounds = get(bounds)
    const $stickyColumn = get(stickyColumn)
    ui.actions.blur()

    // Generate new breakpoints for the current columns
    let breakpoints = $visibleColumns.map(col => ({
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
      gridLeft: $bounds.left,
      width: $bounds.width,
    })

    // Add listeners to handle mouse movement
    document.addEventListener("mousemove", onReorderMouseMove)
    document.addEventListener("mouseup", stopReordering)

    // Trigger a move event immediately so ensure a candidate column is chosen
    onReorderMouseMove(e)
  }

  // Callback when moving the mouse when reordering columns
  const onReorderMouseMove = e => {
    // Immediately handle the current position
    const x = e.clientX
    reorder.update(state => ({
      ...state,
      latestX: x,
    }))
    considerReorderPosition()

    // Check if we need to start auto-scrolling
    const $reorder = get(reorder)
    const proximityCutoff = 140
    const speedFactor = 8
    const rightProximity = Math.max(0, $reorder.gridLeft + $reorder.width - x)
    const leftProximity = Math.max(0, x - $reorder.gridLeft)
    if (rightProximity < proximityCutoff) {
      const weight = proximityCutoff - rightProximity
      const increment = (weight / proximityCutoff) * speedFactor
      reorder.update(state => ({ ...state, increment }))
      startAutoScroll()
    } else if (leftProximity < proximityCutoff) {
      const weight = -1 * (proximityCutoff - leftProximity)
      const increment = (weight / proximityCutoff) * speedFactor
      reorder.update(state => ({ ...state, increment }))
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
  }

  // Actual logic to consider the current position and determine the new order
  const considerReorderPosition = () => {
    const $reorder = get(reorder)
    const $scroll = get(scroll)

    // Compute the closest breakpoint to the current position
    let targetColumn
    let minDistance = Number.MAX_SAFE_INTEGER
    const mouseX = $reorder.latestX - $reorder.gridLeft + $scroll.left
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

  // Commences auto-scrolling in a certain direction, triggered when the mouse
  // approaches the edges of the grid
  const startAutoScroll = () => {
    if (isAutoScrolling) {
      return
    }
    isAutoScrolling = true
    autoScrollInterval = setInterval(() => {
      const $maxLeft = get(maxScrollLeft)
      const { increment } = get(reorder)
      scroll.update(state => ({
        ...state,
        left: Math.max(0, Math.min($maxLeft, state.left + increment)),
      }))
      considerReorderPosition()
    }, 10)
  }

  // Stops auto scrolling
  const stopAutoScroll = () => {
    isAutoScrolling = false
    clearInterval(autoScrollInterval)
  }

  // Callback when stopping reordering columns
  const stopReordering = async () => {
    // Ensure auto-scrolling is stopped
    stopAutoScroll()

    // Swap position of columns
    let { sourceColumn, targetColumn } = get(reorder)
    moveColumn(sourceColumn, targetColumn)

    // Reset state
    reorder.set(reorderInitialState)

    // Remove event handlers
    document.removeEventListener("mousemove", onReorderMouseMove)
    document.removeEventListener("mouseup", stopReordering)

    // Save column changes
    await columns.actions.saveChanges()
  }

  // Moves a column after another columns.
  // An undefined target column will move the source to index 0.
  const moveColumn = (sourceColumn, targetColumn) => {
    let $columns = get(columns)
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
  }

  // Moves a column one place left (as appears visually)
  const moveColumnLeft = async column => {
    const $visibleColumns = get(visibleColumns)
    const sourceIdx = $visibleColumns.findIndex(x => x.name === column)
    moveColumn(column, $visibleColumns[sourceIdx - 2]?.name)
    await columns.actions.saveChanges()
  }

  // Moves a column one place right (as appears visually)
  const moveColumnRight = async column => {
    const $visibleColumns = get(visibleColumns)
    const sourceIdx = $visibleColumns.findIndex(x => x.name === column)
    if (sourceIdx === $visibleColumns.length - 1) {
      return
    }
    moveColumn(column, $visibleColumns[sourceIdx + 1]?.name)
    await columns.actions.saveChanges()
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
  }
}
