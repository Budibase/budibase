<script>
  import { getContext, onMount } from "svelte"

  const { columns, selectedCellId, rand, visibleCells, cellHeight, rows } =
    getContext("spreadsheet")

  const padding = 180

  let ref
  let width
  let height
  let scrollLeft = 0
  let scrollTop = 0

  $: computeVisibleCells($columns, scrollLeft, scrollTop, width, height)
  $: contentHeight = ($rows.length + 2) * cellHeight + padding
  $: contentWidth = computeContentWidth($columns)
  $: horizontallyScrolled = scrollLeft > 0

  const computeContentWidth = columns => {
    let total = 40 + padding
    columns.forEach(col => {
      total += col.width
    })
    return total
  }

  // Store the current scroll position
  const handleScroll = e => {
    // Only update scroll offsets when a sizable change happens
    if (Math.abs(scrollTop - e.target.scrollTop) > 10) {
      scrollTop = e.target.scrollTop
    }
    if (Math.abs(scrollLeft - e.target.scrollLeft) > 10) {
      scrollLeft = e.target.scrollLeft
    }
    if (e.target.scrollLeft === 0) {
      scrollLeft = 0
    }
  }

  const computeVisibleCells = (
    columns,
    scrollLeft,
    scrollTop,
    width,
    height
  ) => {
    if (!columns.length) {
      return
    }

    // Compute row visibility
    const rows = Math.ceil(height / cellHeight) + 8
    const firstRow = Math.max(0, Math.floor(scrollTop / cellHeight) - 4)
    const visibleRows = [firstRow, firstRow + rows]

    // Compute column visibility
    let startColIdx = 1
    let rightEdge = columns[1].width
    while (rightEdge < scrollLeft) {
      startColIdx++
      rightEdge += columns[startColIdx].width
    }
    let endColIdx = startColIdx + 1
    let leftEdge = columns[0].width + 40 + rightEdge
    while (leftEdge < width + scrollLeft) {
      leftEdge += columns[endColIdx]?.width
      endColIdx++
    }
    const visibleColumns = [Math.max(1, startColIdx - 2), endColIdx + 2]

    visibleCells.set({
      x: visibleColumns,
      y: visibleRows,
    })
  }

  onMount(() => {
    // Observe and record the height of the body
    const observer = new ResizeObserver(entries => {
      width = entries[0].contentRect.width
      height = entries[0].contentRect.height
    })
    observer.observe(ref)
    return () => {
      observer.disconnect()
    }
  })

  let sheetStyles = ""
  let left = 0
  for (let i = 0; i < 20; i++) {
    if (i === 1) {
      left += 40
    }
    sheetStyles += `--col-${i}-width:${160}px; --col-${i}-left:${left}px;`
    left += 160
  }
</script>

<div
  bind:this={ref}
  class="spreadsheet"
  class:horizontally-scrolled={horizontallyScrolled}
  on:scroll={handleScroll}
  on:click|self={() => ($selectedCellId = null)}
  id={`sheet-${rand}-body`}
  style={sheetStyles}
>
  <div
    class="content"
    style="height:{contentHeight}px; width:{contentWidth}px;"
  >
    <slot />
  </div>
</div>

<style>
  .spreadsheet {
    display: block;
    overflow: auto;
    height: 800px;
    position: relative;
    cursor: default;
  }
  .content {
    min-width: 100%;
    min-height: 100%;
  }

  /* Add shadow to sticky cells when horizontally scrolled */
  .horizontally-scrolled :global(.cell.sticky) {
    border-right-width: 1px;
  }
  .horizontally-scrolled :global(.cell.sticky:after) {
    content: " ";
    position: absolute;
    width: 10px;
    left: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }
</style>
