<script>
  import { getContext, onMount } from "svelte"
  import { Utils } from "../../utils"

  const { columns, selectedCellId, rand, cellHeight, rows, bounds, scroll } =
    getContext("spreadsheet")

  const padding = 180

  let ref

  $: contentHeight = ($rows.length + 2) * cellHeight
  $: contentWidth = computeContentWidth($columns)

  const computeContentWidth = columns => {
    if (!columns.length) {
      return 0
    }
    const last = columns[columns.length - 1]
    return last.left + last.width
  }

  const updateScrollStore = Utils.domDebounce((left, top) => {
    scroll.set({ left, top })
  })

  const handleScroll = e => {
    updateScrollStore(e.target.scrollLeft, e.target.scrollTop)
  }

  onMount(() => {
    // Observe and record the height of the body
    const observer = new ResizeObserver(() => {
      bounds.set(ref.getBoundingClientRect())
    })
    observer.observe(ref)
    return () => {
      observer.disconnect()
    }
  })
</script>

<div
  bind:this={ref}
  class="sheet-body"
  class:horizontally-scrolled={$scroll.left > 0}
  on:click|self={() => ($selectedCellId = null)}
  id={`sheet-${rand}-body`}
  on:scroll={handleScroll}
>
  <div
    class="content"
    style="height:{contentHeight + padding}px; width:{contentWidth +
      padding}px;"
  >
    <div
      class="data-content"
      style="height:{contentHeight}px; width:{contentWidth}px;"
    >
      <slot />
    </div>
  </div>
</div>

<style>
  .sheet-body {
    display: block;
    position: relative;
    cursor: default;
    overflow: auto;
    flex: 1 1 auto;
    height: 0;
  }
  .sheet-body::-webkit-scrollbar-track {
    background: transparent;
  }
  .content,
  .data-content {
    position: absolute;
  }
  .content {
    min-width: 100%;
    min-height: 100%;
    background: var(--background-alt);
  }
  .data-content {
    background: var(--cell-background);
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
