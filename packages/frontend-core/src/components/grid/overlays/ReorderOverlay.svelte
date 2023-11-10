<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "../layout/GridScrollWrapper.svelte"
  import { DefaultRowHeight, GutterWidth } from "../lib/constants"

  const {
    isReordering,
    reorder,
    visibleColumns,
    stickyColumn,
    rowHeight,
    renderedRows,
    scrollLeft,
  } = getContext("grid")

  $: targetColumn = $reorder.targetColumn
  $: minLeft = GutterWidth + ($stickyColumn?.width || 0)
  $: left = getLeft(targetColumn, $stickyColumn, $visibleColumns, $scrollLeft)
  $: height = $rowHeight * $renderedRows.length + DefaultRowHeight
  $: style = `left:${left}px; height:${height}px;`
  $: visible = $isReordering && left >= minLeft

  const getLeft = (targetColumn, stickyColumn, visibleColumns, scrollLeft) => {
    let left = GutterWidth + (stickyColumn?.width || 0) - scrollLeft

    // If this is not the sticky column, add additional left space
    if (targetColumn !== stickyColumn?.name) {
      const column = visibleColumns.find(x => x.name === targetColumn)
      if (!column) {
        return left
      }
      left += column.left + column.width
    }

    return left
  }
</script>

{#if visible}
  <div class="reorder-wrapper">
    <GridScrollWrapper scrollVertically>
      <div class="reorder-overlay" {style} />
    </GridScrollWrapper>
  </div>
{/if}

<style>
  .reorder-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
  }
  .reorder-overlay {
    position: absolute;
    top: 0;
    width: 2px;
    background: var(--accent-color);
    margin-left: -2px;
  }
</style>
