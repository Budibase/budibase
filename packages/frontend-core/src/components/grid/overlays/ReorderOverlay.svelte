<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "../layout/GridScrollWrapper.svelte"
  import { DefaultRowHeight } from "../lib/constants"

  const {
    isReordering,
    reorder,
    columnLookupMap,
    rowHeight,
    renderedRows,
    scrollLeft,
    stickyWidth,
  } = getContext("grid")

  $: targetColumn = $columnLookupMap[$reorder.targetColumn]
  $: insertAfter = $reorder.insertAfter
  $: left = getLeft(targetColumn, insertAfter, $scrollLeft)
  $: height = $rowHeight * $renderedRows.length + DefaultRowHeight
  $: style = `left:${left}px; height:${height}px;`
  $: visible = $isReordering && left >= $stickyWidth

  const getLeft = (targetColumn, insertAfter, scrollLeft) => {
    if (!targetColumn) {
      return 0
    }
    let left = targetColumn.__left - scrollLeft
    if (insertAfter) {
      left += targetColumn.width
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
