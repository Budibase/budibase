<script>
  import { getContext } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"

  const { renderedColumns } = getContext("sheet")
</script>

<div class="header">
  <SheetScrollWrapper scrollVertically={false} wheelInteractive={false}>
    <div class="row">
      {#each $renderedColumns as column, idx}
        <HeaderCell {column} {idx} />
      {/each}
    </div>
  </SheetScrollWrapper>
</div>

<style>
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    height: var(--row-height);
    z-index: 1;
  }
  .row {
    display: flex;
  }
</style>
