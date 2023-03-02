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
    hoveredRowId,
  } = getContext("spreadsheet")

  export let scrollVertically = true
  export let scrollHorizontally = true
  export let wheelInteractive = true

  $: scrollTop = $scroll.top
  $: scrollLeft = $scroll.left
  $: offsetY = -1 * (scrollTop % cellHeight)
  $: hiddenWidths = calculateHiddenWidths($visibleColumns)
  $: offsetX = -1 * scrollLeft + hiddenWidths
  $: rowCount = $visibleRows.length
  $: contentWidth = calculateContentWidth($visibleColumns, scrollHorizontally)
  $: contentHeight = calculateContentHeight(rowCount, scrollVertically)
  $: innerStyle = getInnerStyle(
    offsetX,
    offsetY,
    contentWidth,
    contentHeight,
    scrollHorizontally,
    scrollVertically
  )
  $: outerStyle = getOuterStyle(
    offsetX,
    offsetY,
    contentWidth,
    contentHeight,
    scrollHorizontally,
    scrollVertically
  )

  const getInnerStyle = (
    offsetX,
    offsetY,
    contentWidth,
    contentHeight,
    scrollH,
    scrollV
  ) => {
    if (!scrollH) {
      offsetX = 0
    }
    if (!scrollV) {
      offsetY = 0
    }
    let style = `--offset-x:${offsetX}px;--offset-y:${offsetY}px;`
    // if (scrollH && contentWidth) {
    //   style += `width:${contentWidth}px;`
    // }
    // if (scrollV && contentHeight) {
    //   style += `height:${contentHeight}px;`
    // }
    return style
  }

  const getOuterStyle = (
    offsetX,
    offsetY,
    contentWidth,
    contentHeight,
    scrollH,
    scrollV
  ) => {
    let style = ""
    // if (scrollV) {
    //   style += `height:${contentHeight + offsetY}px;`
    // }
    // if (scrollH) {
    //   style += `width:${contentWidth + offsetX}px;`
    // }
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
      ($rows.length + 1) * cellHeight - $bounds.height + 180
    )
    newScrollTop = Math.max(0, newScrollTop)
    scroll.update(state => ({
      ...state,
      top: newScrollTop,
    }))

    // Hover row under cursor
    const y = e.clientY - $bounds.top + (newScrollTop % cellHeight)
    const hoveredRow = $visibleRows[Math.floor(y / cellHeight)]
    $hoveredRowId = hoveredRow?._id
  }
</script>

<div class="outer" on:wheel|passive={wheelInteractive ? handleWheel : null}>
  <div class="inner" style={innerStyle}>
    <slot />
  </div>
</div>

<style>
  div {
  }
  .outer {
    min-width: 100%;
    min-height: 100%;
  }
  .inner {
    transform: translate3d(var(--offset-x), var(--offset-y), 0);
  }
</style>
