<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../utils/utils"

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
    selectedCellId,
  } = getContext("sheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: hiddenWidths = calculateHiddenWidths($visibleColumns)
  $: scrollLeft = $scroll.left
  $: scrollTop = $scroll.top
  $: style = generateStyle($scroll, hiddenWidths)

  const generateStyle = (scroll, hiddenWidths) => {
    const offsetX = scrollHorizontally ? -1 * scroll.left + hiddenWidths : 0
    const offsetY = scrollVertically ? -1 * (scroll.top % cellHeight) : 0
    return `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
  }

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
    const modifier = e.ctrlKey || e.metaKey
    let x = modifier ? e.deltaY : e.deltaX
    let y = modifier ? e.deltaX : e.deltaY
    debouncedHandleWheel(x, y, e.clientY)
  }
  const debouncedHandleWheel = domDebounce((deltaX, deltaY, clientY) => {
    // Calculate new scroll top
    let newScrollTop = scrollTop + deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, $maxScrollTop))

    // Calculate new scroll left
    let newScrollLeft = scrollLeft + deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, $maxScrollLeft))

    // Update state
    scroll.set({
      left: newScrollLeft,
      top: newScrollTop,
    })

    // Hover row under cursor
    const y = clientY - $bounds.top + (newScrollTop % cellHeight)
    const hoveredRow = $visibleRows[Math.floor(y / cellHeight)]
    $hoveredRowId = hoveredRow?._id
  })
</script>

<div
  class="outer"
  on:wheel={wheelInteractive ? handleWheel : null}
  on:click|self={() => ($selectedCellId = null)}
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
