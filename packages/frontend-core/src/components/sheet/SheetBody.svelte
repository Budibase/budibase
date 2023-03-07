<script>
  import { getContext, onMount } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import NewRow from "./NewRow.svelte"
  import SheetRow from "./SheetRow.svelte"

  const { bounds, visibleRows, config } = getContext("sheet")

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
  <SheetScrollWrapper>
    {#each $visibleRows as row, idx}
      <SheetRow {row} {idx} />
    {/each}
    {#if $config.allowAddRows}
      <NewRow />
    {/if}
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
