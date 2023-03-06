<script>
  import { getContext } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "./cells/HeaderCell.svelte"

  const { visibleColumns } = getContext("sheet")
</script>

<div class="header">
  <SheetScrollWrapper scrollVertically={false} wheelInteractive={false}>
    <div class="row">
      {#each $visibleColumns as column}
        <HeaderCell {column} />
      {/each}
    </div>
  </SheetScrollWrapper>
</div>

<style>
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    z-index: 1;
  }
  .row {
    display: flex;
  }
</style>
