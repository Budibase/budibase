<script>
  import { getContext } from "svelte"

  const {
    cellHeight,
    scroll,
    bounds,
    rows,
    columns,
    visibleRows,
    visibleColumns,
  } = getContext("spreadsheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: scrollTop = $scroll.top
  $: scrollLeft = $scroll.left
  $: offsetY = scrollVertically ? -1 * (scrollTop % cellHeight) : 0
  $: hiddenWidths = calculateHiddenWidths($visibleColumns)
  $: offsetX = scrollHorizontally ? -1 * scrollLeft + hiddenWidths : 0
  $: rowCount = $visibleRows.length
  $: contentWidth = calculateContentWidth($visibleColumns, scrollHorizontally)
  $: contentHeight = calculateContentHeight(rowCount, scrollVertically)
  $: style = getStyle(offsetX, offsetY, contentWidth, contentHeight)

  const getStyle = (offsetX, offsetY, contentWidth, contentHeight) => {
    let style = `--offset-y:${offsetY}px; --offset-x:${offsetX}px;`
    if (contentWidth) {
      style += `--width:${contentWidth}px;`
    }
    if (contentHeight) {
      style += `--height:${contentHeight}px;`
    }
    return style
  }

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

  const calculateContentWidth = (columns, scroll) => {
    if (!scroll) {
      return null
    }
    let width = 0
    columns.forEach(col => (width += col.width))
    return width
  }

  const calculateContentHeight = (rowCount, scroll) => {
    if (!scroll) {
      return null
    }
    return (rowCount + 1) * cellHeight
  }

  const handleWheel = e => {
    const step = cellHeight * 3
    const deltaY = e.deltaY < 0 ? -1 : 1
    const offset = deltaY * step
    let newScrollTop = scrollTop
    newScrollTop += offset
    newScrollTop = Math.min(
      newScrollTop,
      ($rows.length + 1) * cellHeight - $bounds.height
    )
    newScrollTop = Math.max(0, newScrollTop)
    scroll.update(state => ({
      ...state,
      top: newScrollTop,
    }))
  }
</script>

<div
  class="scroll-wrapper"
  {style}
  on:wheel|passive={wheelInteractive ? handleWheel : null}
>
  <slot />
</div>

<style>
  .scroll-wrapper {
    min-width: 100%;
    min-height: 100%;
    background: var(--background-alt);
    transform: translate3d(var(--offset-x), var(--offset-y), 0);
    overflow: hidden;
    width: var(--width);
    height: var(--height);
  }
</style>
