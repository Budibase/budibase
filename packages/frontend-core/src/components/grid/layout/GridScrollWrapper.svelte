<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../../utils/utils"

  const {
    rowHeight,
    scroll,
    focusedCellId,
    renderedRows,
    maxScrollTop,
    maxScrollLeft,
    bounds,
    hoveredRowId,
    hiddenColumnsWidth,
  } = getContext("grid")

  export let scrollVertically = false
  export let scrollHorizontally = false
  export let wheelInteractive = false

  $: style = generateStyle($scroll, $rowHeight, $hiddenColumnsWidth)

  const generateStyle = (scroll, rowHeight, hiddenWidths) => {
    const offsetX = scrollHorizontally ? -1 * scroll.left + hiddenWidths : 0
    const offsetY = scrollVertically ? -1 * (scroll.top % rowHeight) : 0
    return `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
  }

  // Handles a wheel even and updates the scroll offsets
  const handleWheel = e => {
    e.preventDefault()
    debouncedHandleWheel(e.deltaX, e.deltaY, e.clientY)
  }
  const debouncedHandleWheel = domDebounce((deltaX, deltaY, clientY) => {
    const { top, left } = $scroll

    // Calculate new scroll top
    let newScrollTop = top + deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, $maxScrollTop))

    // Calculate new scroll left
    let newScrollLeft = left + deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, $maxScrollLeft))

    // Update state
    scroll.set({
      left: scrollHorizontally ? newScrollLeft : left,
      top: scrollVertically ? newScrollTop : top,
    })

    // Hover row under cursor
    const y = clientY - $bounds.top + (newScrollTop % $rowHeight)
    const hoveredRow = $renderedRows[Math.floor(y / $rowHeight)]
    hoveredRowId.set(hoveredRow?._id)
  })
</script>

<div
  class="outer"
  on:wheel={wheelInteractive ? handleWheel : null}
  on:click|self={() => ($focusedCellId = null)}
>
  <div {style} class="inner">
    <slot />
  </div>
</div>

<style>
  .outer {
    min-width: 100%;
    min-height: 100%;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .inner {
    position: absolute;
  }
</style>
