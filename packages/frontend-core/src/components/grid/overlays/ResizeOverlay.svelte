<script>
  import { getContext } from "svelte"
  import { GutterWidth } from "../lib/constants"

  const { resize, visibleColumns, displayColumn, isReordering, scrollLeft } =
    getContext("grid")

  $: offset = GutterWidth + ($displayColumn?.width || 0)
  $: activeColumn = $resize.column

  const getStyle = (column, offset, scrollLeft) => {
    const left = offset + column.__left + column.width - scrollLeft
    return `left:${left}px;`
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if !$isReordering}
  {#if $displayColumn}
    <div
      class="resize-slider"
      class:visible={activeColumn === $displayColumn.name}
      on:mousedown={e => resize.actions.startResizing($displayColumn, e)}
      on:touchstart={e => resize.actions.startResizing($displayColumn, e)}
      on:dblclick={() => resize.actions.resetSize($displayColumn)}
      style="left:{GutterWidth + $displayColumn.width}px;"
    >
      <div class="resize-indicator" />
    </div>
  {/if}
  {#each $visibleColumns as column}
    <div
      class="resize-slider"
      class:visible={activeColumn === column.name}
      on:mousedown={e => resize.actions.startResizing(column, e)}
      on:touchstart={e => resize.actions.startResizing(column, e)}
      on:dblclick={() => resize.actions.resetSize(column)}
      style={getStyle(column, offset, $scrollLeft)}
    >
      <div class="resize-indicator" />
    </div>
  {/each}
{/if}

<style>
  .resize-slider {
    position: absolute;
    top: 0;
    height: var(--default-row-height);
    opacity: 0;
    padding: 0 8px;
    transform: translateX(-50%);
    user-select: none;
  }
  .resize-slider:hover,
  .resize-slider.visible {
    cursor: col-resize;
    opacity: 1;
  }
  .resize-indicator {
    margin-left: -1px;
    width: 2px;
    height: 100%;
    background: var(--accent-color);
  }
</style>
