<script>
  import { getContext, onMount } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { selectedCellId, hoveredRowId, bounds } = getContext("spreadsheet")

  let ref

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
  on:click|self={() => ($selectedCellId = null)}
  on:mouseleave={() => ($hoveredRowId = null)}
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
</style>
