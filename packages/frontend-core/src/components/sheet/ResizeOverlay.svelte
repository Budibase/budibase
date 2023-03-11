<script>
  import { getContext } from "svelte"

  const {
    columns,
    resize,
    scroll,
    renderedColumns,
    stickyColumn,
    isReordering,
  } = getContext("sheet")

  $: scrollLeft = $scroll.left
  $: cutoff = scrollLeft + 40 + ($columns[0]?.width || 0)
  $: offset = 40 + ($stickyColumn?.width || 0)
  $: column = $resize.column

  const getStyle = (column, offset, scrollLeft) => {
    const left = offset + column.left + column.width - scrollLeft
    return `left:${left}px;`
  }
</script>

{#if !$isReordering}
  {#if $stickyColumn}
    <div
      class="resize-slider sticky"
      class:visible={column === $stickyColumn.name}
      on:mousedown={e => resize.actions.startResizing($stickyColumn, e)}
      style="left:{40 + $stickyColumn.width}px;"
    >
      <div class="resize-indicator" />
    </div>
  {/if}
  {#each $renderedColumns as column}
    <div
      class="resize-slider"
      class:visible={column === column.name}
      on:mousedown={e => resize.actions.startResizing(column, e)}
      style={getStyle(column, offset, scrollLeft)}
    >
      <div class="resize-indicator" />
    </div>
  {/each}
{/if}

<style>
  .resize-slider {
    position: absolute;
    top: 0;
    z-index: 1;
    height: var(--cell-height);
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
  .resize-slider.sticky {
    z-index: 2;
  }
  .resize-indicator {
    margin-left: -1px;
    width: 2px;
    height: 100%;
    background: var(--spectrum-global-color-blue-400);
  }
</style>
