<script>
  import { getContext } from "svelte"

  const { resize, visibleColumns, isReordering, scrollLeft } =
    getContext("grid")

  const getStyle = (column, scrollLeft) => {
    let left = column.__left + column.width
    if (!column.primaryDisplay) {
      left -= scrollLeft
    }
    return `left:${left}px;`
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if !$isReordering}
  {#each $visibleColumns as column}
    <div
      class="resize-slider"
      class:visible={$resize.column === column.name}
      on:mousedown={e => resize.actions.startResizing(column, e)}
      on:touchstart={e => resize.actions.startResizing(column, e)}
      on:dblclick={() => resize.actions.resetSize(column)}
      style={getStyle(column, $scrollLeft)}
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
