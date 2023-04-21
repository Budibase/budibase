<script>
  import { getContext, onMount } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import GridRow from "./GridRow.svelte"

  const { bounds, renderedRows, rowVerticalInversionIndex } = getContext("grid")

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

<div bind:this={body} class="grid-body">
  <GridScrollWrapper scrollHorizontally scrollVertically wheelInteractive>
    {#each $renderedRows as row, idx}
      <GridRow {row} {idx} invertY={idx >= $rowVerticalInversionIndex} />
    {/each}
  </GridScrollWrapper>
</div>

<style>
  .grid-body {
    display: block;
    position: relative;
    cursor: default;
    overflow: hidden;
    flex: 1 1 auto;
  }
</style>
