<script>
  import { getContext, onMount } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import SheetRow from "./SheetRow.svelte"
  import { MaxCellRenderHeight } from "../lib/constants"

  const { bounds, renderedRows, visualRowCapacity, cellHeight } =
    getContext("sheet")

  let body

  $: inversionIdx =
    $visualRowCapacity - Math.ceil(MaxCellRenderHeight / cellHeight) - 2
  $: console.log(inversionIdx)

  onMount(() => {
    // Observe and record the height of the body
    const observer = new ResizeObserver(() => {
      bounds.set(body.getBoundingClientRect())
    })
    observer.observe(body)
    return () => {
      observer.disconnect()
    }
  })
</script>

<div bind:this={body} class="sheet-body">
  <SheetScrollWrapper>
    {#each $renderedRows as row, idx}
      <SheetRow {row} {idx} invert={idx >= inversionIdx} />
    {/each}
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
