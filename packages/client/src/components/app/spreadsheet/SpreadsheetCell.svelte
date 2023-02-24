<script>
  export let header = false
  export let label = false
  export let spacer = false
  export let rowHovered = false
  export let rowSelected = false
  export let sticky = false
  export let selected = false
  export let reorderSource = false
  export let reorderTarget = false
  export let id = null
  export let column
</script>

<div
  class="cell"
  class:header
  class:label
  class:spacer
  class:row-selected={rowSelected}
  class:row-hovered={rowHovered}
  class:sticky
  class:selected
  class:reorder-source={reorderSource}
  class:reorder-target={reorderTarget}
  on:focus
  on:mouseenter
  on:click
  on:mousedown
  {id}
  style={`width:var(--col-${column}-width); left:var(--col-${column}-left);`}
>
  <slot />
</div>

<style>
  /* Cells */
  .cell {
    height: var(--cell-height);
    border-style: solid;
    border-color: var(--spectrum-global-color-gray-300);
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
  }
  .cell.row-hovered {
    background: var(--cell-background-hover);
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
    background-color: rgb(224, 242, 255);
  }

  /* Header cells */
  .cell.header {
    background: var(--spectrum-global-color-gray-200);
    padding: 0 var(--cell-padding);
    z-index: 3;
    border-color: var(--spectrum-global-color-gray-400);
  }
  .cell.header :global(span) {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  /* Sticky styles */
  .cell.sticky {
    position: sticky;
    left: 40px;
    z-index: 2;
    border-left-color: transparent;
  }
  .cell.sticky.selected {
    z-index: 3;
  }
  .cell.header.sticky {
    z-index: 4;
  }

  /* Reorder styles */
  .cell.reorder-source {
    background: var(--spectrum-global-color-gray-100);
  }
  .cell.header.reorder-source {
    background: var(--spectrum-global-color-gray-200);
  }
  .cell.reorder-target {
    border-left-color: var(--spectrum-global-color-blue-400);
  }

  /* Label cells */
  .cell.label {
    padding: 0 12px;
    border-left-width: 0;
    position: sticky;
    left: 0;
    z-index: 2;
  }
  .cell.label.header {
    z-index: 4;
  }
  .cell.label :global(span) {
    min-width: 14px;
    text-align: center;
    color: var(--spectrum-global-color-gray-500);
  }
  .cell.label :global(input[type="checkbox"]) {
    margin: 0;
  }

  /* Spacer cells */
  .cell.spacer {
    background: none;
    border-bottom: none;
  }
</style>
