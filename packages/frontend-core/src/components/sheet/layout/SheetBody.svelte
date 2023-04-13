<script>
  import { getContext, onMount } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import SheetRow from "./SheetRow.svelte"

  const { bounds, renderedRows, rowVerticalInversionIndex } =
    getContext("sheet")

  let body

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
  <SheetScrollWrapper scrollHorizontally scrollVertically wheelInteractive>
    {#each $renderedRows as row, idx}
      <SheetRow {row} {idx} invertY={idx >= $rowVerticalInversionIndex} />
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
