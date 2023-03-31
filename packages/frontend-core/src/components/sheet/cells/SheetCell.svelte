<script>
  export let rowSelected = false
  export let rowHovered = false
  export let selected = false
  export let reorderSource = false
  export let reorderTarget = false
  export let width = ""
  export let center = false
  export let selectedUser = null
  export let rowIdx
  export let error = null

  $: style = getStyle(width, selectedUser)

  const getStyle = (width, selectedUser) => {
    let style = `flex: 0 0 ${width}px;`
    if (selectedUser) {
      style += `--user-color:${selectedUser.color};`
    }
    return style
  }
</script>

<div
  class="cell"
  class:row-selected={rowSelected}
  class:row-hovered={rowHovered}
  class:selected
  class:selected-other={selectedUser != null}
  class:reorder-source={reorderSource}
  class:reorder-target={reorderTarget}
  class:center
  class:error={error && selected}
  on:focus
  on:mousedown
  on:mouseup
  on:click
  on:contextmenu
  {style}
  data-row={rowIdx}
>
  <slot />
  {#if selected && error}
    <div class="label">
      {error}
    </div>
  {:else if selectedUser && !selected}
    <div class="label">
      {selectedUser.label}
    </div>
  {/if}
</div>

<style>
  /* Cells */
  .cell {
    height: var(--row-height);
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
  .cell.selected:after,
  .cell.error:after,
  .cell.selected-other:not(.selected):after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 2px solid transparent;
    pointer-events: none;
    border-radius: 2px;
    box-sizing: border-box;
  }
  .cell.selected {
    z-index: 2;
  }
  .cell.selected:after {
    border-color: var(--spectrum-global-color-blue-400);
  }
  .cell.error:after {
    border-color: var(--spectrum-global-color-red-400);
  }
  .cell.selected-other:not(.selected) {
    z-index: 1;
  }
  .cell.selected-other:not(.selected):after {
    border-color: var(--spectrum-global-color-red-400);
  }
  .cell:not(.selected) {
    user-select: none;
  }
  .cell:hover {
    cursor: default;
  }
  .cell.row-selected {
    --cell-background: var(--spectrum-global-color-gray-75);
  }
  .cell.row-hovered {
    --cell-background: var(--cell-background-hover);
  }
  .cell.center {
    justify-content: center;
  }

  /* Reorder styles */
  .cell.reorder-source {
    --cell-background: var(--spectrum-global-color-gray-100);
  }
  .cell.reorder-target:after {
    content: " ";
    position: absolute;
    right: 0;
    background: var(--spectrum-global-color-blue-400);
    width: 2px;
    height: calc(var(--row-height) + 2px);
  }

  /* Other user email */
  .label {
    position: absolute;
    bottom: 100%;
    margin: 0 0 -2px 0;
    padding: 1px 4px 3px 4px;
    background: var(--user-color);
    border-radius: 2px 2px 0 0;
    display: none;
    color: white;
    font-size: 12px;
    font-weight: 600;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    user-select: none;
  }
  .cell[data-row="0"] .label {
    bottom: auto;
    top: 100%;
    border-radius: 0 0 2px 2px;
    padding: 2px 4px 2px 4px;
    margin: -2px 0 0 0;
  }
  .cell:hover .label {
    display: block;
  }
  .error .label {
    background: var(--spectrum-global-color-red-400);
    display: block;
  }
</style>
