<script>
  import { getContext } from "svelte"
  import { domDebounce, debounce, throttle } from "../../utils/utils"

  const { scroll, bounds, rows, cellHeight, columns } =
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
  $: barTop = barOffset + availHeight * (scrollTop / maxScrollTop)

  // Calculate H scrollbar size and offset
  $: lastCol = $columns[$columns.length - 1]
  $: contentWidth = lastCol ? lastCol?.left + lastCol?.width : 0
  $: barWidth = Math.max(50, (width / contentWidth) * width)
  $: availWidth = width - barWidth - 8
  $: maxScrollLeft = contentWidth - width
  $: barLeft = 4 + availWidth * (scrollLeft / maxScrollLeft)

  // Calculate whether to show scrollbars or not
  $: showVScrollbar = contentHeight > height
  $: showHScrollbar = contentWidth > width

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
