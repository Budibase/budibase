<script>
  import { get } from "svelte/store"
  import { getContext } from "svelte"

  const { columns, rand, visibleColumns } = getContext("spreadsheet")
  const MinColumnWidth = 100

  let initialMouseX = null
  let initialWidth = null
  let columnIdx = null
  let width = 0
  let left = 0
  let columnCount = 0

  const startResizing = (idx, e) => {
    const $columns = get(columns)
    // Prevent propagation to stop reordering triggering
    e.stopPropagation()

    width = $columns[idx].width
    left = $columns[idx].left
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

    columns.update(state => {
      state[columnIdx].width = newWidth
      let offset = state[columnIdx].left + newWidth
      for (let i = columnIdx + 1; i < state.length; i++) {
        state[i].left = offset
        offset += state[i].width
      }
      return state
    })

    // let newStyle = `--col-${columnIdx}-width:${newWidth}px;`
    //
    // let offset = left + newWidth
    // for (let i = columnIdx + 1; i < columnCount; i++) {
    //   const colWidth = parseInt(styles.getPropertyValue(`--col-${i}-width`))
    //   newStyle += `--col-${i}-left:${offset}px;`
    //   offset += colWidth
    // }
    //
    // sheet.style.cssText += newStyle

    // let cells = sheet.querySelectorAll(`[data-col="${columnIdx}"]`)
    // let left
    // cells.forEach(cell => {
    //   cell.style.width = `${newWidth}px`
    //   cell.dataset.width = newWidth
    //   if (!left) {
    //     left = parseInt(cell.dataset.left)
    //   }
    // })
    //
    // let offset = left + newWidth
    // for (let i = columnIdx + 1; i < columnCount; i++) {
    //   cells = sheet.querySelectorAll(`[data-col="${i}"]`)
    //   let colWidth
    //   cells.forEach(cell => {
    //     cell.style.transform = `translateX(${offset}px)`
    //     cell.dataset.left = offset
    //     if (!colWidth) {
    //       colWidth = parseInt(cell.dataset.width)
    //     }
    //   })
    //   offset += colWidth
    // }

    width = newWidth

    // Update width of column
    // columns.update(state => {
    //   state[$resize.columnIdx].width = Math.round(newWidth)
    //
    //   // Update left offset of other columns
    //   let offset = 40
    //   state.forEach(col => {
    //     col.left = offset
    //     offset += col.width
    //   })
    //
    //   return state
    // })
  }

  const stopResizing = () => {
    columnIdx = null
    document.removeEventListener("mousemove", onResizeMouseMove)
    document.removeEventListener("mouseup", stopResizing)
    document.getElementById(`sheet-${rand}`).classList.remove("is-resizing")
  }
</script>

{#each $columns as col}
  <div
    class="resize-slider"
    class:visible={columnIdx === col.idx}
    on:mousedown={e => startResizing(col.idx, e)}
    style="--left:{col.left + col.width}px;"
  >
    <div class="resize-indicator" />
  </div>
{/each}

<style>
  .resize-slider {
    position: absolute;
    top: var(--controls-height);
    z-index: 6;
    height: var(--cell-height);
    left: var(--left);
    opacity: 0;
    padding: 0 16px;
    transform: translateX(-50%);
    user-select: none;
  }
  .resize-slider:hover,
  .resize-slider.visible {
    cursor: col-resize;
    opacity: 1;
    height: calc(100% - var(--controls-height));
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
