<script>
  export let header = false
  export let label = false
  export let rowSelected = false
  export let rowHovered = false
  export let sticky = false
  export let selected = false
  export let reorderSource = false
  export let reorderTarget = false
  export let width
</script>

<div
  class="cell"
  class:header
  class:label
  class:row-selected={rowSelected}
  class:row-hovered={rowHovered}
  class:sticky
  class:selected
  class:reorder-source={reorderSource}
  class:reorder-target={reorderTarget}
  on:focus
  on:click
  on:mousedown
  style="--width:{width}px;"
>
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
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--cell-font-size);
    gap: var(--cell-spacing);
    background: var(--cell-background);
    flex: 0 0 var(--width);
    position: relative;
    width: 0;
  }
  .cell.selected {
    box-shadow: inset 0 0 0 2px var(--spectrum-global-color-blue-400);
    z-index: 1;
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

  /* Header cells */
  .cell.header {
    background: var(--background);
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
    z-index: 25;
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
    height: calc(var(--cell-height) + 1px);
  }

  /* Label cells */
  .cell.label {
    padding: var(--cell-padding);
    flex: 0 0 40px;
    border-right: none;
    position: sticky;
    left: 0;
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
