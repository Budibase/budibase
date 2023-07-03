<script>
  import { getContext } from "svelte"
  import { GutterWidth } from "../lib/constants"

  const { resize, renderedColumns, stickyColumn, isReordering, scrollLeft } =
    getContext("grid")

  $: offset = GutterWidth + ($stickyColumn?.width || 0)
  $: activeColumn = $resize.column

  const getStyle = (column, offset, scrollLeft) => {
    const left = offset + column.left + column.width - scrollLeft
    return `left:${left}px;`
  }
</script>

{#if !$isReordering}
  {#if $stickyColumn}
    <div
      class="resize-slider"
      class:visible={activeColumn === $stickyColumn.name}
      on:mousedown={e => resize.actions.startResizing($stickyColumn, e)}
      on:dblclick={() => resize.actions.resetSize($stickyColumn)}
      style="left:{GutterWidth + $stickyColumn.width}px;"
    >
      <div class="resize-indicator" />
    </div>
  {/if}
  {#each $renderedColumns as column}
    <div
      class="resize-slider"
      class:visible={activeColumn === column.name}
      on:mousedown={e => resize.actions.startResizing(column, e)}
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
