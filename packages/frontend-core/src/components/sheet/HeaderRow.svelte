<script>
  import { getContext } from "svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "./cells/HeaderCell.svelte"
  import { Icon } from "@budibase/bbui"

  const { renderedColumns, dispatch, config } = getContext("sheet")
</script>

<div class="header">
  <SheetScrollWrapper scrollVertically={false} wheelInteractive={false}>
    <div class="row">
      {#each $renderedColumns as column, idx}
        <HeaderCell {column} {idx} />
      {/each}
    </div>
  </SheetScrollWrapper>
  {#if $config.allowAddColumns}
    <div class="new-column" on:click={() => dispatch("add-column")}>
      <Icon size="S" name="Add" />
    </div>
  {/if}
</div>

<style>
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    z-index: 1;
    height: var(--cell-height);
  }
  .row {
    display: flex;
  }
  .new-column {
    position: absolute;
    right: 0;
    top: 0;
    height: var(--cell-height);
    background: var(--spectrum-global-color-gray-100);
    display: grid;
    place-items: center;
    width: 46px;
    border-left: var(--cell-border);
    border-bottom: var(--cell-border);
  }
  .new-column:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
</style>
