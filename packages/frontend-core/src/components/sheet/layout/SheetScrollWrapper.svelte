<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../../utils/utils"

  const {
    rowHeight,
    scroll,
    visibleColumns,
    renderedColumns,
    selectedCellId,
    renderedRows,
    maxScrollTop,
    maxScrollLeft,
    bounds,
    hoveredRowId,
  } = getContext("sheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: hiddenWidths = calculateHiddenWidths($renderedColumns)
  $: style = generateStyle($scroll, $rowHeight, hiddenWidths)

  const generateStyle = (scroll, rowHeight, hiddenWidths) => {
    const offsetX = scrollHorizontally ? -1 * scroll.left + hiddenWidths : 0
    const offsetY = scrollVertically ? -1 * (scroll.top % rowHeight) : 0
    return `transform: translate3d(${offsetX}px, ${offsetY}px, 0);`
  }

  // Calculates with total width of all columns currently not rendered
  const calculateHiddenWidths = renderedColumns => {
    const idx = $visibleColumns.findIndex(
      col => col.name === renderedColumns[0]?.name
    )
    let width = 0
    if (idx > 0) {
      for (let i = 0; i < idx; i++) {
        width += $visibleColumns[i].width
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
    const { top, left } = $scroll

    // Calculate new scroll top
    let newScrollTop = top + deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, $maxScrollTop))

    // Calculate new scroll left
    let newScrollLeft = left + deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, $maxScrollLeft))

    // Update state
    scroll.set({
      left: newScrollLeft,
      top: newScrollTop,
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
