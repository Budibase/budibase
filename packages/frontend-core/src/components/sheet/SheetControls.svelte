<script>
  import { getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"

  const { rows } = getContext("spreadsheet")

  $: rowCount = $rows.length
</script>

<div class="controls">
  <div class="buttons">
    <ActionButton icon="Filter" quiet size="M">Filter</ActionButton>
    <ActionButton icon="Group" quiet size="M">Group</ActionButton>
    <ActionButton icon="SortOrderDown" quiet size="M">Sort</ActionButton>
    <ActionButton icon="VisibilityOff" quiet size="M">Hide fields</ActionButton>
  </div>
  <div class="title" />
  <div class="delete">
    {rowCount} row{rowCount === 1 ? "" : "s"}
  </div>
</div>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: var(--controls-height);
    padding: 0 12px;
    background: var(--background);
    gap: 8px;
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
  }
  .title {
    font-weight: 600;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: calc(1 * var(--cell-spacing));
    margin-left: -8px;
  }
</style>
