<script>
  export let focused = false
  export let selected = false
  export let highlighted = false
  export let width = ""
  export let selectedUser = null
  export let error = null
  export let rowIdx
  export let topRow = false
  export let defaultHeight = false
  export let center = false
  export let readonly = false
  export let hidden = false
  export let metadata = null

  $: style = getStyle(width, selectedUser, metadata)

  const getStyle = (width, selectedUser, metadata) => {
    let style
    if (width === "auto" || width === "100%") {
      style = `width: ${width};`
    } else {
      style = `flex: 0 0 ${width}px;`
    }
    if (selectedUser) {
      style += `--user-color :${selectedUser.color};`
    }
    if (metadata?.backgroundColor) {
      style += `--cell-background: ${metadata.backgroundColor};`
    }
    if (metadata?.textColor) {
      style += `--cell-font-color: ${metadata.textColor};`
    }
    return style
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="cell"
  class:selected
  class:highlighted
  class:focused
  class:error
  class:center
  class:readonly
  class:hidden
  class:default-height={defaultHeight}
  class:selected-other={selectedUser != null}
  class:alt={rowIdx % 2 === 1}
  class:top={topRow}
  on:focus
  on:mousedown
  on:mouseup
  on:click
  on:contextmenu
  on:touchstart|passive
  on:touchend
  on:touchcancel
  on:mouseenter
  {style}
>
  {#if error}
    <div class="label">
      {error}
    </div>
  {/if}
  <slot />
  {#if selectedUser && !focused}
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
    align-items: flex-start;
    color: var(--cell-font-color);
    font-size: var(--cell-font-size);
    gap: var(--cell-spacing);
    background: var(--cell-background);
    position: relative;
    width: 0;
    --cell-color: transparent;
  }
  .cell.alt {
    --cell-background: var(--cell-background-alt);
  }
  .cell.default-height {
    height: var(--default-row-height);
  }
  .cell.center {
    align-items: center;
  }
  .cell.hidden {
    content-visibility: hidden;
  }

  /* Cell border */
  .cell.focused::after,
  .cell.error::after,
  .cell.selected-other:not(.focused)::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 2px solid var(--cell-color);
    pointer-events: none;
    border-radius: 2px;
    box-sizing: border-box;
  }

  /* Cell background overlay */
  .cell.selected::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    box-sizing: border-box;
    height: calc(100% + 1px);
    width: calc(100% + 1px);
    opacity: 0.16;
    background: var(--spectrum-global-color-blue-400);
    z-index: 2;
    pointer-events: none;
  }

  /* Cell border for cells with labels */
  .cell.error::after {
    border-radius: 0 2px 2px 2px;
  }
  .cell.top.error::after {
    border-radius: 2px 2px 2px 0;
  }
  .cell.selected-other:not(.focused)::after {
    border-radius: 2px;
  }

  /* Cell z-index */
  .cell.error,
  .cell.selected-other:not(.focused) {
    z-index: 1;
  }
  .cell.focused {
    z-index: 2;
  }
  .cell.selected-other:hover {
    z-index: 2;
  }
  .cell:not(.focused) {
    user-select: none;
  }
  .cell:hover {
    cursor: default;
  }

  /* Cell color overrides */
  .cell.selected-other {
    --cell-color: var(--user-color);
  }
  .cell.focused {
    --cell-color: var(--accent-color);
  }
  .cell.error {
    --cell-color: var(--spectrum-global-color-red-500);
  }
  .cell.focused.readonly {
    --cell-color: var(--spectrum-global-color-gray-600);
  }
  .cell.highlighted:not(.focused):not(.selected),
  .cell.focused.readonly {
    --cell-background: var(--cell-background-hover);
  }

  /* Label for additional text */
  .label {
    position: absolute;
    bottom: 100%;
    left: 0;
    padding: 1px 4px 3px 4px;
    margin: 0 0 -2px 0;
    background: var(--cell-color);
    border-radius: 2px;
    display: block;
    color: white;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    user-select: none;
  }
  .cell.top .label {
    bottom: auto;
    top: 100%;
    padding: 2px 4px 2px 4px;
    margin: -2px 0 0 0;
  }
  .error .label {
    background: var(--spectrum-global-color-red-500);
  }
  .selected-other:not(.error) .label {
    display: none;
  }
  .selected-other:not(.error):hover .label {
    display: block;
  }
</style>
