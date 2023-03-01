<script>
  import { getContext } from "svelte"

  const { cellHeight, scroll, bounds, rows, columns, visibleRows } =
    getContext("spreadsheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: scrollTop = $scroll.top
  $: scrollLeft = $scroll.left
  $: offsetY = scrollVertically ? -1 * (scrollTop % cellHeight) : 0
  $: offsetX = scrollHorizontally ? -1 * scrollLeft : 0
  $: rowCount = $visibleRows.length
  $: contentWidth = calculateContentWidth($columns, scrollHorizontally)
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
    newScrollTop = Math.max(0, newScrollTop)
    newScrollTop = Math.min(
      newScrollTop,
      ($rows.length + 1) * cellHeight - $bounds.height
    )
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
    background: var(--background-alt);
    transform: translate3d(var(--offset-x), var(--offset-y), 0);
    overflow: hidden;
    width: var(--width);
    height: var(--height);
    position: relative;
  }
</style>
