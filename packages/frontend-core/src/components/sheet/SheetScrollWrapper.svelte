<script>
  import { getContext } from "svelte"

  const {
    cellHeight,
    scroll,
    bounds,
    columns,
    visibleRows,
    visibleColumns,
    hoveredRowId,
    maxScrollTop,
    maxScrollLeft,
  } = getContext("spreadsheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: hiddenWidths = calculateHiddenWidths($visibleColumns)
  $: scrollLeft = $scroll.left
  $: scrollTop = $scroll.top
  $: offsetX = scrollHorizontally ? -1 * scrollLeft + hiddenWidths : 0
  $: offsetY = scrollVertically ? -1 * (scrollTop % cellHeight) : 0

  // Calculates with total width of all columns currently not rendered
  const calculateHiddenWidths = visibleColumns => {
    const idx = visibleColumns[0]?.idx
    let width = 0
    if (idx > 0) {
      for (let i = 0; i < idx; i++) {
        width += $columns[i].width
      }
    }
    return width
  }

  // Handles a wheel even and updates the scroll offsets
  const handleWheel = e => {
    e.preventDefault()

    // Calculate new scroll top
    let newScrollTop = scrollTop + e.deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, $maxScrollTop))

    // Calculate new scroll left
    let newScrollLeft = scrollLeft + e.deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, $maxScrollLeft))

    // Update state
    scroll.set({
      left: newScrollLeft,
      top: newScrollTop,
    })

    // Hover row under cursor
    const y = e.clientY - $bounds.top + (newScrollTop % cellHeight)
    const hoveredRow = $visibleRows[Math.floor(y / cellHeight)]
    $hoveredRowId = hoveredRow?._id
  }
</script>

<div class="outer" on:wheel={wheelInteractive ? handleWheel : null}>
  <div class="inner" style="--offset-x:{offsetX}px;--offset-y:{offsetY}px;">
    <slot />
  </div>
</div>

<style>
  .outer {
    min-width: 100%;
    min-height: 100%;
  }
  .inner {
    transform: translate3d(var(--offset-x), var(--offset-y), 0);
  }
</style>
