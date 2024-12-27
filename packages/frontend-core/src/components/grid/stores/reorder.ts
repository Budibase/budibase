import { get, writable, derived, Writable, Readable } from "svelte/store"
import { parseEventLocation } from "../lib/utils"
import { Store as StoreContext } from "."

interface Breakpoint {
  x: number
  column: string
  insertAfter: boolean
}

interface ReorderInitialStoreData {
  sourceColumn: string | null
  targetColumn: string | null
  insertAfter?: boolean
  breakpoints: Breakpoint[]
  gridLeft: number
  width: number
  increment?: number
}

const reorderInitialState: ReorderInitialStoreData = {
  sourceColumn: null,
  targetColumn: null,
  insertAfter: false,
  breakpoints: [],
  gridLeft: 0,
  width: 0,
  increment: 0,
}

interface ReorderInitialStore {
  reorder: Writable<ReorderInitialStoreData>
  isReordering: Readable<boolean>
}

export type Store = ReorderInitialStore

export const createStores = (): ReorderInitialStore => {
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

export const createActions = (context: StoreContext) => {
  const {
    reorder,
    columns,
    columnLookupMap,
    scrollableColumns,
    scroll,
    bounds,
    visibleColumns,
    datasource,
    stickyWidth,
    width,
    scrollLeft,
    maxScrollLeft,
  } = context
  let latestX = 0
  let autoScrollInterval: NodeJS.Timeout
  let isAutoScrolling: boolean

  // Callback when dragging on a colum header and starting reordering
  const startReordering = (column: string, e: MouseEvent | TouchEvent) => {
    const $scrollableColumns = get(scrollableColumns)
    const $bounds = get(bounds)
    const $stickyWidth = get(stickyWidth)

    // Generate new breakpoints for the current columns
    const breakpoints = $scrollableColumns.map(col => ({
      x: col.__left - $stickyWidth,
      column: col.name,
      insertAfter: false,
    }))

    // Add a very left breakpoint as well
    const lastCol = $scrollableColumns[$scrollableColumns.length - 1]
    if (lastCol) {
      breakpoints.push({
        x: lastCol.__left + lastCol.width - $stickyWidth,
        column: lastCol.name,
        insertAfter: true,
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
    document.addEventListener("touchmove", onReorderMouseMove)
    document.addEventListener("touchend", stopReordering)
    document.addEventListener("touchcancel", stopReordering)

    // Trigger a move event immediately so ensure a candidate column is chosen
    onReorderMouseMove(e)
  }

  // Callback when moving the mouse when reordering columns
  const onReorderMouseMove = (e: MouseEvent | TouchEvent) => {
    // Immediately handle the current position
    const { x } = parseEventLocation(e)
    latestX = x
    considerReorderPosition()

    // Check if we need to start auto-scrolling
    const $scrollLeft = get(scrollLeft)
    const $maxScrollLeft = get(maxScrollLeft)
    const $reorder = get(reorder)
    const proximityCutoff = Math.min(140, get(width) / 6)
    const speedFactor = 16
    const rightProximity = Math.max(0, $reorder.gridLeft + $reorder.width - x)
    const leftProximity = Math.max(0, x - $reorder.gridLeft)
    if (rightProximity < proximityCutoff && $scrollLeft < $maxScrollLeft) {
      const weight = proximityCutoff - rightProximity
      const increment = (weight / proximityCutoff) * speedFactor
      reorder.update(state => ({ ...state, increment }))
      startAutoScroll()
    } else if (leftProximity < proximityCutoff && $scrollLeft > 0) {
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
    const $scrollLeft = get(scrollLeft)

    // Compute the closest breakpoint to the current position
    let breakpoint: Breakpoint | undefined
    let minDistance = Number.MAX_SAFE_INTEGER
    const mouseX = latestX - $reorder.gridLeft + $scrollLeft
    $reorder.breakpoints.forEach(point => {
      const distance = Math.abs(point.x - mouseX)
      if (distance < minDistance) {
        minDistance = distance
        breakpoint = point
      }
    })
    if (
      breakpoint &&
      (breakpoint.column !== $reorder.targetColumn ||
        breakpoint.insertAfter !== $reorder.insertAfter)
    ) {
      reorder.update(state => ({
        ...state,
        targetColumn: breakpoint!.column,
        insertAfter: breakpoint!.insertAfter,
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
        left: Math.max(0, Math.min($maxLeft, state.left + increment!)),
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

    // Remove event handlers
    document.removeEventListener("mousemove", onReorderMouseMove)
    document.removeEventListener("mouseup", stopReordering)
    document.removeEventListener("touchmove", onReorderMouseMove)
    document.removeEventListener("touchend", stopReordering)
    document.removeEventListener("touchcancel", stopReordering)

    // Ensure there's actually a change before saving
    const { sourceColumn, targetColumn, insertAfter } = get(reorder)
    reorder.set(reorderInitialState)
    if (sourceColumn !== targetColumn) {
      await moveColumn({
        sourceColumn: sourceColumn!,
        targetColumn: targetColumn!,
        insertAfter,
      })
    }
  }

  // Moves a column after another columns.
  // An undefined target column will move the source to index 0.
  const moveColumn = async ({
    sourceColumn,
    targetColumn,
    insertAfter = false,
  }: {
    sourceColumn: string
    targetColumn: string
    insertAfter?: boolean
  }) => {
    // Find the indices in the overall columns array
    const $columns = get(columns)
    let sourceIdx = $columns.findIndex(col => col.name === sourceColumn)
    let targetIdx = $columns.findIndex(col => col.name === targetColumn)
    if (insertAfter) {
      targetIdx++
    }

    // Reorder columns
    columns.update(state => {
      const removed = state.splice(sourceIdx, 1)
      if (--targetIdx < sourceIdx) {
        targetIdx++
      }
      return state.toSpliced(targetIdx, 0, removed[0])
    })

    // Extract new orders as schema mutations
    get(columns).forEach((column, idx) => {
      const { related } = column
      const mutation = { order: idx }
      if (!related) {
        datasource.actions.addSchemaMutation(column.name, mutation)
      } else {
        datasource.actions.addSubSchemaMutation(
          related.subField,
          related.field,
          mutation
        )
      }
    })

    await datasource.actions.saveSchemaMutations()
  }

  // Moves a column one place left (as appears visually)
  const moveColumnLeft = async (column: string) => {
    const $visibleColumns = get(visibleColumns)
    const $columnLookupMap = get(columnLookupMap)
    const sourceIdx = $columnLookupMap[column].__idx
    await moveColumn({
      sourceColumn: column,
      targetColumn: $visibleColumns[sourceIdx - 1]?.name,
    })
  }

  // Moves a column one place right (as appears visually)
  const moveColumnRight = async (column: string) => {
    const $visibleColumns = get(visibleColumns)
    const $columnLookupMap = get(columnLookupMap)
    const sourceIdx = $columnLookupMap[column].__idx
    if (sourceIdx === $visibleColumns.length - 1) {
      return
    }
    await moveColumn({
      sourceColumn: column,
      targetColumn: $visibleColumns[sourceIdx + 1]?.name,
      insertAfter: true,
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
  }
}
