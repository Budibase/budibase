<script>
  import { getContext } from "svelte"
  import SheetScrollWrapper from "../layout/SheetScrollWrapper.svelte"

  const {
    isReordering,
    reorder,
    visibleColumns,
    gutterWidth,
    stickyColumn,
    rowHeight,
    renderedRows,
  } = getContext("sheet")

  $: targetColumn = $reorder.targetColumn
  $: left = getLeft(targetColumn, $stickyColumn, $visibleColumns)
  $: height = $rowHeight * ($renderedRows.length + 1)
  $: style = `left:${left}px; height:${height}px;`

  const getLeft = (targetColumn, stickyColumn, visibleColumns) => {
    let left = gutterWidth + (stickyColumn?.width || 0)

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

{#if $isReordering}
  <div class="reorder-wrapper">
    <SheetScrollWrapper scrollVertically>
      <div class="reorder-overlay" {style} />
    </SheetScrollWrapper>
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
    background: var(--spectrum-global-color-blue-400);
    margin-left: -2px;
  }
</style>
