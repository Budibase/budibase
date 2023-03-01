<script>
  import { getContext } from "svelte"
  import { domDebounce, debounce, throttle } from "../../utils/utils"

  const { scroll, bounds, rows, cellHeight, columns, stickyColumn } =
    getContext("spreadsheet")

  // Bar config
  const barOffset = 4

  // State for dragging bars
  let initialMouse
  let initialScroll

  // Memoize store primitives to reduce reactive statement invalidations
  $: scrollTop = $scroll.top
  $: scrollLeft = $scroll.left
  $: height = $bounds.height
  $: width = $bounds.width

  // Calculate V scrollbar size and offset
  $: contentHeight = ($rows.length + 1) * cellHeight
  $: barHeight = Math.max(50, (height / contentHeight) * height)
  $: availHeight = height - barHeight - 2 * barOffset
  $: maxScrollTop = contentHeight - height
  $: barTop = barOffset + cellHeight + availHeight * (scrollTop / maxScrollTop)

  // Calculate H scrollbar size and offset
  $: contentWidth = calculateContentWidth($columns, $stickyColumn)
  $: totalWidth = width + 40 + $stickyColumn?.width || 0
  $: barWidth = Math.max(50, (totalWidth / contentWidth) * totalWidth)
  $: availWidth = totalWidth - barWidth - 2 * barOffset
  $: maxScrollLeft = contentWidth - totalWidth
  $: barLeft = barOffset + availWidth * (scrollLeft / maxScrollLeft)

  // Calculate whether to show scrollbars or not
  $: showVScrollbar = contentHeight > height
  $: showHScrollbar = contentWidth > width

  const calculateContentWidth = (columns, stickyColumn) => {
    let width = 40 + stickyColumn?.width
    columns.forEach(col => {
      width += col.width
    })
    return width
  }

  // V scrollbar drag handlers
  const startVDragging = e => {
    e.preventDefault()
    initialMouse = e.clientY
    initialScroll = scrollTop
    document.addEventListener("mousemove", moveVDragging)
    document.addEventListener("mouseup", stopVDragging)
  }
  const moveVDragging = domDebounce(e => {
    const delta = e.clientY - initialMouse
    const weight = delta / availHeight
    const newScrollTop = initialScroll + weight * maxScrollTop
    scroll.update(state => ({
      ...state,
      top: Math.max(0, Math.min(newScrollTop, maxScrollTop)),
    }))
  })
  const stopVDragging = () => {
    document.removeEventListener("mousemove", moveVDragging)
    document.removeEventListener("mouseup", stopVDragging)
  }

  // H scrollbar drag handlers
  const startHDragging = e => {
    e.preventDefault()
    initialMouse = e.clientX
    initialScroll = scrollLeft
    document.addEventListener("mousemove", moveHDragging)
    document.addEventListener("mouseup", stopHDragging)
  }
  const moveHDragging = domDebounce(e => {
    const delta = e.clientX - initialMouse
    const weight = delta / availWidth
    const newScrollLeft = initialScroll + weight * maxScrollLeft
    scroll.update(state => ({
      ...state,
      left: Math.max(0, Math.min(newScrollLeft, maxScrollLeft)),
    }))
  })
  const stopHDragging = () => {
    document.removeEventListener("mousemove", moveHDragging)
    document.removeEventListener("mouseup", stopHDragging)
  }
</script>

{#if showVScrollbar}
  <div
    class="v-scrollbar"
    style="--top:{barTop}px; height:{barHeight}px;"
    on:mousedown={startVDragging}
  />
{/if}
{#if showHScrollbar}
  <div
    class="h-scrollbar"
    style="--left:{barLeft}px; width:{barWidth}px;"
    on:mousedown={startHDragging}
  />
{/if}

<style>
  div {
    position: absolute;
    background: var(--spectrum-global-color-gray-600);
    opacity: 0.6;
    border-radius: 4px;
    z-index: 20;
    transition: opacity 130ms ease-out;
  }
  div:hover {
    opacity: 0.9;
  }
  .v-scrollbar {
    top: var(--top);
    height: var(--height);
    right: 4px;
    width: 8px;
  }
  .h-scrollbar {
    bottom: 4px;
    height: 8px;
    width: var(--width);
    left: var(--left);
  }
</style>
