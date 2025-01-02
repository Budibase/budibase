import { writable, get, derived, Writable, Readable } from "svelte/store"
import { MinColumnWidth, DefaultColumnWidth } from "../lib/constants"
import { parseEventLocation } from "../lib/utils"
import { Store as StoreContext } from "."
import { UIColumn } from "@budibase/types"

interface ResizeInitialStoreData {
  initialMouseX: number | null
  initialWidth: number | null
  column: string | null
  width: number
  left: number
  related?: UIColumn["related"]
}

const initialState: ResizeInitialStoreData = {
  initialMouseX: null,
  initialWidth: null,
  column: null,
  width: 0,
  left: 0,
}

interface ResizeInitialStore {
  resize: Writable<ResizeInitialStoreData>
  isResizing: Readable<boolean>
}

export type Store = ResizeInitialStore

export const createStores = (): ResizeInitialStore => {
  const resize = writable(initialState)
  const isResizing = derived(resize, $resize => $resize.column != null, false)
  return {
    resize,
    isResizing,
  }
}

export const createActions = (context: StoreContext) => {
  const { resize, ui, datasource } = context

  // Starts resizing a certain column
  const startResizing = (column: UIColumn, e: MouseEvent | TouchEvent) => {
    const { x } = parseEventLocation(e)

    // Prevent propagation to stop reordering triggering
    e.stopPropagation()
    e.preventDefault()
    ui.actions.blur()

    // Set initial store state
    resize.set({
      width: column.width,
      left: column.__left,
      initialWidth: column.width,
      initialMouseX: x,
      column: column.name,
      related: column.related,
    })

    // Add mouse event listeners to handle resizing
    document.addEventListener("mousemove", onResizeMouseMove)
    document.addEventListener("mouseup", stopResizing)
    document.addEventListener("touchmove", onResizeMouseMove)
    document.addEventListener("touchend", stopResizing)
    document.addEventListener("touchcancel", stopResizing)
  }

  // Handler for moving the mouse to resize columns
  const onResizeMouseMove = (e: MouseEvent | TouchEvent) => {
    const { initialMouseX, initialWidth, width, column, related } = get(resize)
    const { x } = parseEventLocation(e)
    const dx = x - initialMouseX!
    const newWidth = Math.round(Math.max(MinColumnWidth, initialWidth! + dx))

    // Ignore small changes
    if (Math.abs(width - newWidth) < 5) {
      return
    }

    // Update column state
    if (!related) {
      datasource.actions.addSchemaMutation(column!, { width })
    } else {
      datasource.actions.addSubSchemaMutation(related.subField, related.field, {
        width,
      })
    }

    // Update state
    resize.update(state => ({
      ...state,
      width: newWidth,
    }))
  }

  // Stop resizing any columns
  const stopResizing = async () => {
    // Reset state
    const $resize = get(resize)
    resize.set(initialState)
    document.removeEventListener("mousemove", onResizeMouseMove)
    document.removeEventListener("mouseup", stopResizing)
    document.removeEventListener("touchmove", onResizeMouseMove)
    document.removeEventListener("touchend", stopResizing)
    document.removeEventListener("touchcancel", stopResizing)

    // Persist width if it changed
    if ($resize.width !== $resize.initialWidth) {
      await datasource.actions.saveSchemaMutations()
    }
  }

  // Resets a column size back to default
  const resetSize = async (column: { name: string }) => {
    datasource.actions.addSchemaMutation(column.name, {
      width: DefaultColumnWidth,
    })
    await datasource.actions.saveSchemaMutations()
  }

  return {
    resize: {
      ...resize,
      actions: {
        startResizing,
        resetSize,
      },
    },
  }
}
