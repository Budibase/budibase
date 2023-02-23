<script>
  import { getContext, onMount } from "svelte"
  import { Utils } from "@budibase/frontend-core"

  const { columns, selectedCellId, rand, visibleRows, cellHeight } =
    getContext("spreadsheet")

  let ref
  let height = 0
  let horizontallyScrolled = false
  let scrollTop = 0

  $: gridStyles = getGridStyles($columns)
  $: computeVisibleRows(scrollTop, height)

  const getGridStyles = columns => {
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

  const computeVisibleRows = Utils.debounce((scrollTop, height) => {
    const rows = Math.ceil(height / cellHeight) + 16
    const firstRow = Math.max(0, Math.floor(scrollTop / cellHeight) - 8)
    visibleRows.set([firstRow, firstRow + rows])
  }, 50)

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
  style={gridStyles}
  on:click|self={() => ($selectedCellId = null)}
  id={`sheet-${rand}-body`}
>
  <slot />
</div>

<style>
  .spreadsheet {
    display: grid;
    grid-template-columns: var(--grid);
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
    max-height: 600px;
    position: relative;
    cursor: default;
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
