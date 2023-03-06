<script>
  export let header = false
  export let label = false
  export let rowSelected = false
  export let rowHovered = false
  export let sticky = false
  export let selected = false
  export let reorderSource = false
  export let reorderTarget = false
  export let width = ""
  export let center = false
  export let selectedUser = null
</script>

<div
  class="cell"
  class:header
  class:label
  class:row-selected={rowSelected}
  class:row-hovered={rowHovered}
  class:sticky
  class:selected
  class:selected-other={selectedUser != null}
  class:reorder-source={reorderSource}
  class:reorder-target={reorderTarget}
  class:center
  on:focus
  on:click
  on:mousedown
  style="flex: 0 0 {width}px;"
>
  {#if selectedUser}
    <div class="name">
      {selectedUser.email}
    </div>
  {/if}
  <slot />
</div>

<style>
  /* Cells */
  .cell {
    height: var(--cell-height);
    border-bottom: var(--cell-border);
    border-right: var(--cell-border);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-800);
    font-size: var(--cell-font-size);
    gap: var(--cell-spacing);
    background: var(--cell-background);
    position: relative;
    width: 0;
  }
  .cell.selected {
    box-shadow: inset 0 0 0 2px var(--spectrum-global-color-blue-400);
    z-index: 1;
  }
  .cell.selected-other {
    box-shadow: inset 0 0 0 2px var(--spectrum-global-color-purple-400);
  }
  .cell:not(.selected) {
    user-select: none;
  }
  .cell:hover {
    cursor: default;
  }
  .cell.row-selected {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .cell.row-hovered {
    background: var(--cell-background-hover);
  }
  .cell.center {
    justify-content: center;
  }

  /* Header cells */
  .cell.header {
    background: var(--background);
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
    border-bottom: none;
  }
  .cell.header :global(> span) {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .cell.header:hover {
    cursor: pointer;
  }

  /* Reorder styles */
  .cell.reorder-source {
    background: var(--spectrum-global-color-gray-100);
  }
  .cell.header.reorder-source {
    background: var(--spectrum-global-color-gray-200);
  }
  .cell.reorder-target:after {
    content: " ";
    position: absolute;
    right: 0;
    background: var(--spectrum-global-color-blue-400);
    width: 2px;
    height: calc(var(--cell-height) + 2px);
  }

  /* Label cells */
  .cell.label {
    padding: var(--cell-padding);
    flex: 0 0 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .name {
    position: absolute;
    bottom: 100%;
    background: var(--spectrum-global-color-purple-400);
    padding: 1px 4px 0 4px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
  }
</style>
