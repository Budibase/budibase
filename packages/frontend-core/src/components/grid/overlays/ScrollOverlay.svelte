<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../../utils/utils"
  import { DefaultRowHeight, ScrollBarSize } from "../lib/constants"

  const {
    scroll,
    contentHeight,
    maxScrollTop,
    contentWidth,
    maxScrollLeft,
    screenWidth,
    showHScrollbar,
    showVScrollbar,
    scrollLeft,
    scrollTop,
    height,
  } = getContext("grid")

  // State for dragging bars
  let initialMouse
  let initialScroll

  // Calculate V scrollbar size and offset
  // Terminology is the same for both axes:
  //   renderX - the space available to render the bar in, edge to edge
  //   availX - the space available to render the bar in, until the edge
  $: renderHeight = $height - 2 * ScrollBarSize
  $: barHeight = Math.max(50, ($height / $contentHeight) * renderHeight)
  $: availHeight = renderHeight - barHeight
  $: barTop =
    ScrollBarSize +
    DefaultRowHeight +
    availHeight * ($scrollTop / $maxScrollTop)

  // Calculate H scrollbar size and offset
  $: renderWidth = $screenWidth - 2 * ScrollBarSize
  $: barWidth = Math.max(50, ($screenWidth / $contentWidth) * renderWidth)
  $: availWidth = renderWidth - barWidth
  $: barLeft = ScrollBarSize + availWidth * ($scrollLeft / $maxScrollLeft)

  // V scrollbar drag handlers
  const startVDragging = e => {
    e.preventDefault()
    initialMouse = e.clientY
    initialScroll = $scrollTop
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
    initialScroll = $scrollLeft
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

{#if $showVScrollbar}
  <div
    class="v-scrollbar"
    style="--size:{ScrollBarSize}px; top:{barTop}px; height:{barHeight}px;"
    on:mousedown={startVDragging}
  />
{/if}
{#if $showHScrollbar}
  <div
    class="h-scrollbar"
    style="--size:{ScrollBarSize}px; left:{barLeft}px; width:{barWidth}px;"
    on:mousedown={startHDragging}
  />
{/if}

<style>
  div {
    position: absolute;
    background: var(--spectrum-global-color-gray-500);
    opacity: 0.7;
    border-radius: 4px;
    transition: opacity 130ms ease-out;
  }
  div:hover {
    opacity: 1;
  }
  .v-scrollbar {
    width: var(--size);
    right: var(--size);
  }
  .h-scrollbar {
    height: var(--size);
    bottom: var(--size);
  }
</style>
