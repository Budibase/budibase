<script>
  import { getContext } from "svelte"

  const { columns, selectedCellId, rand } = getContext("spreadsheet")

  let horizontallyScrolled = false

  $: gridStyles = getGridStyles($columns)

  const getGridStyles = columns => {
    const widths = columns?.map(x => x.width)
    if (!widths?.length) {
      return "--grid: 1fr;"
    }
    return `--grid: 40px ${widths.map(x => `${x}px`).join(" ")} 180px;`
  }

  const handleScroll = e => {
    horizontallyScrolled = e.target.scrollLeft > 0
  }
</script>

<div
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
