<script>
  import { getContext, onMount } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import NewRow from "./NewRow.svelte"
  import SheetRow from "./SheetRow.svelte"

  const { selectedCellId, bounds, visibleRows, config } =
    getContext("spreadsheet")

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
>
  <SheetScrollWrapper>
    {#each $visibleRows as row}
      <SheetRow {row} />
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
