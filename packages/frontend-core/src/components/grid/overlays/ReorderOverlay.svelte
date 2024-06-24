<script>
  import { getContext } from "svelte"
  import GridScrollWrapper from "../layout/GridScrollWrapper.svelte"
  import { DefaultRowHeight, GutterWidth } from "../lib/constants"

  const {
    isReordering,
    reorder,
    visibleColumnLookupMap,
    displayColumn,
    rowHeight,
    renderedRows,
    scrollLeft,
  } = getContext("grid")

  $: targetColumn = $visibleColumnLookupMap[$reorder.targetColumn]
  $: console.log(targetColumn)
  $: minLeft = GutterWidth + ($displayColumn?.width || 0)
  $: left = getLeft(targetColumn, $displayColumn, $scrollLeft)
  $: height = $rowHeight * $renderedRows.length + DefaultRowHeight
  $: style = `left:${left}px; height:${height}px;`
  $: visible = $isReordering && left >= minLeft

  const getLeft = (targetColumn, displayColumn, scrollLeft) => {
    if (!targetColumn) {
      return 0
    }
    let left = GutterWidth + (displayColumn?.width || 0) - scrollLeft

    // If this is not the sticky column, add additional left space
    if (!targetColumn.primaryDisplay) {
      left += targetColumn.__left + targetColumn.width
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
