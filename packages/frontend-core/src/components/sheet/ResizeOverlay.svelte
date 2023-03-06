<script>
  import { getContext } from "svelte"

  const { columns, rand, scroll, visibleColumns, stickyColumn, isReordering } =
    getContext("sheet")
  const MinColumnWidth = 100

  let initialMouseX = null
  let initialWidth = null
  let columnIdx = null
  let width = 0
  let left = 0
  let columnCount = 0

  $: scrollLeft = $scroll.left
  $: cutoff = scrollLeft + 40 + ($columns[0]?.width || 0)
  $: offset = 40 + ($stickyColumn?.width || 0)

  const startResizing = (idx, e) => {
    // Prevent propagation to stop reordering triggering
    e.stopPropagation()

    const col = idx === "sticky" ? $stickyColumn : $columns[idx]
    width = col.width
    left = col.left
    initialWidth = width
    initialMouseX = e.clientX
    columnIdx = idx
    columnCount = $columns.length

    // Add mouse event listeners to handle resizing
    document.addEventListener("mousemove", onResizeMouseMove)
    document.addEventListener("mouseup", stopResizing)
    document.getElementById(`sheet-${rand}`).classList.add("is-resizing")
  }

  const onResizeMouseMove = e => {
    const dx = e.clientX - initialMouseX
    const newWidth = Math.round(Math.max(MinColumnWidth, initialWidth + dx))

    if (Math.abs(width - newWidth) < 10) {
      return
    }

    if (columnIdx === "sticky") {
      stickyColumn.update(state => ({
        ...state,
        width: newWidth,
      }))
    } else {
      columns.update(state => {
        state[columnIdx].width = newWidth
        let offset = state[columnIdx].left + newWidth
        for (let i = columnIdx + 1; i < state.length; i++) {
          state[i].left = offset
          offset += state[i].width
        }
        return [...state]
      })
    }

    width = newWidth
  }

  const stopResizing = () => {
    columnIdx = null
    document.removeEventListener("mousemove", onResizeMouseMove)
    document.removeEventListener("mouseup", stopResizing)
    document.getElementById(`sheet-${rand}`).classList.remove("is-resizing")
  }

  const getStyle = (col, offset, scrollLeft) => {
    const left = offset + col.left + col.width - scrollLeft
    return `--left:${left}px;`
  }
</script>

{#if !$isReordering}
  {#if $stickyColumn}
    <div
      class="resize-slider sticky"
      class:visible={columnIdx === "sticky"}
      on:mousedown={e => startResizing("sticky", e)}
      style="--left:{40 + $stickyColumn.width}px;"
    >
      <div class="resize-indicator" />
    </div>
  {/if}
  {#each $visibleColumns as col}
    <div
      class="resize-slider"
      class:visible={columnIdx === col.idx}
      on:mousedown={e => startResizing(col.idx, e)}
      style={getStyle(col, offset, scrollLeft)}
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
    left: var(--left);
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

  :global(.sheet.is-resizing *) {
    cursor: col-resize !important;
  }
  :global(.sheet.is-reordering .resize-slider) {
    display: none;
  }
</style>
