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
  } = getContext("sheet")

  export let scrollVertically = false
  export let scrollHorizontally = false
  export let wheelInteractive = false
  export let foo = false

  $: style = generateStyle($scroll, $rowHeight, $hiddenColumnsWidth, foo)

  const generateStyle = (scroll, rowHeight, hiddenWidths, foo) => {
    let offsetX, offsetY
    if (!foo) {
      offsetX = scrollHorizontally ? -1 * scroll.left + hiddenWidths : 0
      offsetY = scrollVertically ? -1 * (scroll.top % rowHeight) : 0
    } else {
      offsetX = scrollHorizontally ? -1 * scroll.left : 0
      offsetY = scrollVertically ? -1 * scroll.top : 0
    }
    return `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
  }

  // Handles a wheel even and updates the scroll offsets
  const handleWheel = e => {
    e.preventDefault()
    const modifier = e.ctrlKey || e.metaKey
    let x = modifier ? e.deltaY : e.deltaX
    let y = modifier ? e.deltaX : e.deltaY
    debouncedHandleWheel(x, y, e.clientY)
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
  <div {style}>
    <slot />
  </div>
</div>

<style>
  .outer {
    min-width: 100%;
    min-height: 100%;
  }
</style>
