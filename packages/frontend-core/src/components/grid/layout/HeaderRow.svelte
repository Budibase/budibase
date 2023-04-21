<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"

  const { renderedColumns } = getContext("grid")
</script>

<div class="header">
  <GridScrollWrapper scrollHorizontally>
    <div class="row">
      {#each $renderedColumns as column, idx}
        <HeaderCell {column} {idx} />
      {/each}
    </div>
  </GridScrollWrapper>
</div>

<style>
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    height: var(--default-row-height);
    z-index: 1;
  }
  .row {
    display: flex;
  }
</style>
