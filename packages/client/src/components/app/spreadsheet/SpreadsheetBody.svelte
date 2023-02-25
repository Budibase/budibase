<script>
  import { getContext, onMount } from "svelte"
  import { domDebounce } from "../../../utils/domDebounce"

  const {
    columns,
    selectedCellId,
    rand,
    visibleRows,
    visibleColumns,
    cellHeight,
    rows,
    bounds,
    scroll,
  } = getContext("spreadsheet")

  const padding = 180

  let ref
  let scrollLeft = 0
  let scrollTop = 0

  $: updateVisibleRows($columns, scrollTop, $bounds.height)
  $: updateVisibleColumns($columns, scrollLeft, $bounds.width)
  $: contentHeight = ($rows.length + 2) * cellHeight + padding
  $: contentWidth = computeContentWidth($columns)
  $: horizontallyScrolled = scrollLeft > 0

  const computeContentWidth = columns => {
    let total = 40 + padding
    columns.forEach(col => {
      total += col.width
    })
    return total
  }

  // Store the current scroll position
  // let lastTop
  // let lastLeft
  // let ticking = false
  // const handleScroll = e => {
  //   lastTop = e.target.scrollTop
  //   lastLeft = e.target.scrollLeft
  //   if (!ticking) {
  //     ticking = true
  //     requestAnimationFrame(() => {
  //       if (Math.abs(lastTop - scrollTop) > 100) {
  //         scrollTop = lastTop
  //       }
  //       if (lastLeft === 0 || Math.abs(lastLeft - scrollLeft) > 100) {
  //         scrollLeft = lastLeft
  //       }
  //       ticking = false
  //     })
  //   }
  // }

  const handleScroll = domDebounce(
    ({ left, top }) => {
      // Only update local state when big changes occur
      if (Math.abs(top - scrollTop) > 100) {
        scrollTop = top
      }
      if (left === 0 || Math.abs(left - scrollLeft) > 100) {
        scrollLeft = left
      }

      // Always update store
      scroll.set({ left, top })
    },
    e => ({ left: e.target.scrollLeft, top: e.target.scrollTop })
  )

  const updateVisibleRows = (columns, scrollTop, height) => {
    if (!columns.length) {
      return
    }
    // Compute row visibility
    const rows = Math.ceil(height / cellHeight) + 8
    const firstRow = Math.max(0, Math.floor(scrollTop / cellHeight) - 4)
    visibleRows.set([firstRow, firstRow + rows])
  }

  const updateVisibleColumns = (columns, scrollLeft, width) => {
    if (!columns.length) {
      return
    }

    // Compute column visibility
    let startColIdx = 1
    let rightEdge = columns[1].width
    while (rightEdge < scrollLeft) {
      startColIdx++
      rightEdge += columns[startColIdx].width
    }
    let endColIdx = startColIdx + 1
    let leftEdge = columns[0].width + 40 + rightEdge
    while (leftEdge < width + scrollLeft) {
      leftEdge += columns[endColIdx]?.width
      endColIdx++
    }
    visibleColumns.set([Math.max(1, startColIdx - 2), endColIdx + 2])
  }

  onMount(() => {
    // Observe and record the height of the body
    const observer = new ResizeObserver(() => {
      bounds.set(ref.getBoundingClientRect())
    })
    observer.observe(ref)
    return () => {
      observer.disconnect()
    }
  })
</script>

<div
  bind:this={ref}
  class="spreadsheet"
  class:horizontally-scrolled={horizontallyScrolled}
  on:click|self={() => ($selectedCellId = null)}
  id={`sheet-${rand}-body`}
  on:scroll={handleScroll}
>
  <div
    class="content"
    style="height:{contentHeight}px; width:{contentWidth}px;"
  >
    <slot />
  </div>
</div>

<style>
  .spreadsheet {
    display: block;
    height: 800px;
    position: relative;
    cursor: default;
    overflow: auto;
  }
  .content {
    min-width: 100%;
    min-height: 100%;
  }

  /* Add shadow to sticky cells when horizontally scrolled */
  .horizontally-scrolled :global(.cell.sticky) {
    border-right-width: 1px;
  }
  .horizontally-scrolled :global(.cell.sticky:after) {
    content: " ";
    position: absolute;
    width: 10px;
    left: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }
</style>
