<script>
  import { getContext, onMount } from "svelte"
  import { Utils } from "@budibase/frontend-core"

  const { columns, selectedCellId, rand, visibleRows, cellHeight, rows } =
    getContext("spreadsheet")

  let ref
  let height = 600
  let horizontallyScrolled = false
  let scrollTop = 0

  $: gridStyles = getGridStyles($columns)
  $: computeVisibleRows(scrollTop, height)
  $: contentHeight = ($rows.length + 2) * cellHeight + 180
  $: contentWidth = computeWidth($columns)
  $: console.log("new height")

  const computeWidth = columns => {
    console.log("width")
    let width = 220
    columns.forEach(col => {
      width += col.width
    })
    return width
  }

  const getGridStyles = columns => {
    console.log("grid")
    const widths = columns?.map(x => x.width)
    if (!widths?.length) {
      return "--grid: 1fr;"
    }
    return `--grid: 40px ${widths.map(x => `${x}px`).join(" ")} 180px;`
  }

  // Store the current scroll position
  const handleScroll = e => {
    // Update horizontally scrolled flag
    horizontallyScrolled = e.target.scrollLeft > 0

    // Only update scroll top offset when a sizable change happens
    scrollTop = e.target.scrollTop
  }

  const computeVisibleRows = (scrollTop, height) => {
    const rows = Math.ceil(height / cellHeight) + 8
    const firstRow = Math.max(0, Math.floor(scrollTop / cellHeight) - 4)
    visibleRows.set([firstRow, firstRow + rows])
  }

  // Observe and record the height of the body
  onMount(() => {
    const observer = new ResizeObserver(entries => {
      height = entries[0].contentRect.height
    })
    observer.observe(ref)
    return () => {
      observer.disconnect()
    }
  })
</script>

<div
  bind:this={ref}
  class="spreadsheet"
  class:horizontally-scrolled={horizontallyScrolled}
  on:scroll={handleScroll}
  on:click|self={() => ($selectedCellId = null)}
  id={`sheet-${rand}-body`}
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
    background: rgba(255, 0, 0, 0.1);
  }


</style>
