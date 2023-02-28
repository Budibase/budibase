<svelte:options immutable={true} />

<script>
  export let header = false
  export let label = false
  export let rowSelected = false
  export let sticky = false
  export let selected = false
  export let reorderSource = false
  export let reorderTarget = false
  export let left
  export let width
  export let column
</script>

<div
  class="cell col-{column}"
  class:header
  class:label
  class:row-selected={rowSelected}
  class:sticky
  class:selected
  class:reorder-source={reorderSource}
  class:reorder-target={reorderTarget}
  on:focus
  on:mouseenter
  on:click
  on:mousedown
  style="--left: {left}px; --width:{width}px;"
>
  <slot />
</div>

<style>
  /* Cells */
  .cell {
    height: var(--cell-height);
    border-style: solid;
    border-color: var(--spectrum-global-color-gray-200);
    border-width: 0;
    border-bottom-width: 1px;
    border-left-width: 1px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--cell-font-size);
    gap: var(--cell-spacing);
    background: var(--cell-background);
    position: absolute;
    transition: border-color 130ms ease-out;
    width: var(--width);
    left: var(--left);
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

  /* Header cells */
  .cell.header {
    background: var(--background);
    padding: 0 var(--cell-padding);
    border-color: var(--spectrum-global-color-gray-200);
    font-weight: 600;
    gap: calc(2 * var(--cell-spacing));
    z-index: 10;
  }
  .cell.header :global(span) {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .cell.header:hover {
    cursor: pointer;
  }
  .cell.header.sticky,
  .cell.header.label {
    z-index: 11;
  }

  /* Sticky styles */
  .cell.sticky {
    position: sticky;
    border-left-width: 0;
    transform: none;
    left: 40px;
    z-index: 5;
  }
  .cell.selected.sticky {
    z-index: 6;
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
    width: 40px;
    border-left-width: 0;
    position: sticky;
    left: 0;
    z-index: 5;
  }
</style>
