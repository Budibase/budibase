<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../utils/utils"

  const {
    scroll,
    bounds,
    cellHeight,
    stickyColumn,
    contentHeight,
    maxScrollTop,
    contentWidth,
    maxScrollLeft,
  } = getContext("spreadsheet")

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
  // Terminology is the same for both axes:
  //   renderX - the space available to render the bar in, edge to edge
  //   availX - the space available to render the bar in, until the edge
  $: renderHeight = height - 2 * barOffset
  $: barHeight = Math.max(50, (height / $contentHeight) * renderHeight)
  $: availHeight = renderHeight - barHeight
  $: barTop = barOffset + cellHeight + availHeight * (scrollTop / $maxScrollTop)

  // Calculate H scrollbar size and offset
  $: totalWidth = width + 40 + ($stickyColumn?.width || 0)
  $: renderWidth = totalWidth - 2 * barOffset
  $: barWidth = Math.max(50, (totalWidth / $contentWidth) * renderWidth)
  $: availWidth = renderWidth - barWidth
  $: barLeft = barOffset + availWidth * (scrollLeft / $maxScrollLeft)

  // Calculate whether to show scrollbars or not
  $: showVScrollbar = $contentHeight > height
  $: showHScrollbar = $contentWidth > totalWidth

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
    const newScrollTop = initialScroll + weight * $maxScrollTop
    scroll.update(state => ({
      ...state,
      top: Math.max(0, Math.min(newScrollTop, $maxScrollTop)),
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
    const newScrollLeft = initialScroll + weight * $maxScrollLeft
    scroll.update(state => ({
      ...state,
      left: Math.max(0, Math.min(newScrollLeft, $maxScrollLeft)),
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
    style="top:{barTop}px; height:{barHeight}px;"
    on:mousedown={startVDragging}
  />
{/if}
{#if showHScrollbar}
  <div
    class="h-scrollbar"
    style="left:{barLeft}px; width:{barWidth}px;"
    on:mousedown={startHDragging}
  />
{/if}

<style>
  div {
    position: absolute;
    background: var(--spectrum-global-color-gray-600);
    opacity: 0.6;
    border-radius: 4px;
    z-index: 999;
    transition: opacity 130ms ease-out;
  }
  div:hover {
    opacity: 0.9;
  }
  .v-scrollbar {
    right: 4px;
    width: 8px;
  }
  .h-scrollbar {
    bottom: 4px;
    height: 8px;
  }
</style>
