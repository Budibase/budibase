import { get } from "svelte/store"
import { domDebounce } from "../../../utils/utils"

export const createWheelStores = context => {
  const {
    maxScrollLeft,
    maxScrollTop,
    hoveredRowId,
    renderedRows,
    bounds,
    scroll,
    rowHeight,
  } = context

  // Handles a wheel even and updates the scroll offsets
  const handleWheel = e => {
    e.preventDefault()
    const modifier = e.ctrlKey || e.metaKey
    let x = modifier ? e.deltaY : e.deltaX
    let y = modifier ? e.deltaX : e.deltaY
    debouncedHandleWheel(x, y, e.clientY)
  }
  const debouncedHandleWheel = domDebounce((deltaX, deltaY, clientY) => {
    const { top, left } = get(scroll)
    const $rowHeight = get(rowHeight)

    // Calculate new scroll top
    let newScrollTop = top + deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, get(maxScrollTop)))

    // Calculate new scroll left
    let newScrollLeft = left + deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, get(maxScrollLeft)))

    // Update state
    scroll.set({
      left: newScrollLeft,
      top: newScrollTop,
    })

    // Hover row under cursor
    const y = clientY - get(bounds).top + (newScrollTop % $rowHeight)
    const hoveredRow = get(renderedRows)[Math.floor(y / $rowHeight)]
    hoveredRowId.set(hoveredRow?._id)
  })

  return {
    wheel: {
      actions: {
        handleWheel,
      },
    },
  }
}
