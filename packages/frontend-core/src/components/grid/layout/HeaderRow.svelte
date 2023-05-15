<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { Icon } from "@budibase/bbui"

  const {
    renderedColumns,
    dispatch,
    scroll,
    hiddenColumnsWidth,
    width,
    config,
  } = getContext("grid")

  $: columnsWidth = $renderedColumns.reduce(
    (total, col) => (total += col.width),
    0
  )
  $: end = $hiddenColumnsWidth + columnsWidth - 1 - $scroll.left
  $: left = Math.min($width - 40, end)
</script>

<div class="header">
  <GridScrollWrapper scrollHorizontally>
    <div class="row">
      {#each $renderedColumns as column, idx}
        <HeaderCell {column} {idx} />
      {/each}
    </div>
  </GridScrollWrapper>
  {#if $config.allowAddColumns}
    <div
      class="add"
      style="left:{left}px"
      on:click={() => dispatch("add-column")}
    >
      <Icon name="Add" />
    </div>
  {/if}
</div>

<style>
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    height: var(--default-row-height);
  }
  .row {
    display: flex;
  }
  .add {
    height: var(--default-row-height);
    display: grid;
    place-items: center;
    width: 40px;
    position: absolute;
    top: 0;
    border-left: var(--cell-border);
    border-right: var(--cell-border);
    border-bottom: var(--cell-border);
    background: var(--spectrum-global-color-gray-100);
    z-index: 20;
  }
  .add:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
</style>
