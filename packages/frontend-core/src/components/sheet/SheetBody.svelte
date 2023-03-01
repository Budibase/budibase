<script>
  import { getContext, onMount } from "svelte"
  import { Utils } from "../../utils"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { columns, selectedCellId, cellHeight, rows, bounds, scroll } =
    getContext("spreadsheet")

  const padding = 180

  let ref

  $: scrollLeft = $scroll.left
  $: scrollTop = $scroll.top

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
  class:horizontally-scrolled={scrollLeft > 0}
  on:click|self={() => ($selectedCellId = null)}
>
  <SheetScrollWrapper>
    <slot />
  </SheetScrollWrapper>
</div>

<style>
  .sheet-body {
    display: block;
    position: relative;
    cursor: default;
    overflow: hidden;
    flex: 1 1 auto;
  }
  .sheet-body::-webkit-scrollbar-track {
    background: transparent;
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
