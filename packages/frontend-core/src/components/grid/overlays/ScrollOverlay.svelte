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
    isDragging,
    menu,
  } = getContext("grid")

  // State for dragging bars
  let initialMouse
  let initialScroll
  let isDraggingV = false
  let isDraggingH = false

  // Update state to reflect if we are dragging
  $: isDragging.set(isDraggingV || isDraggingH)

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

  // Helper to close the context menu if it's open
  const closeMenu = () => {
    if ($menu.visible) {
      menu.actions.close()
    }
  }

  const getLocation = e => {
    return {
      y: e.touches?.[0]?.clientY ?? e.clientY,
      x: e.touches?.[0]?.clientX ?? e.clientX,
    }
  }

  // V scrollbar drag handlers
  const startVDragging = e => {
    e.preventDefault()
    initialMouse = getLocation(e).y
    initialScroll = $scrollTop
    document.addEventListener("mousemove", moveVDragging)
    document.addEventListener("touchmove", moveVDragging)
    document.addEventListener("mouseup", stopVDragging)
    document.addEventListener("touchend", stopVDragging)
    isDraggingV = true
    closeMenu()
  }
  const moveVDragging = domDebounce(e => {
    const delta = getLocation(e).y - initialMouse
    const weight = delta / availHeight
    const newScrollTop = initialScroll + weight * $maxScrollTop
    scroll.update(state => ({
      ...state,
      top: Math.max(0, Math.min(newScrollTop, $maxScrollTop)),
    }))
  })
  const stopVDragging = () => {
    document.removeEventListener("mousemove", moveVDragging)
    document.removeEventListener("touchmove", moveVDragging)
    document.removeEventListener("mouseup", stopVDragging)
    document.removeEventListener("touchend", stopVDragging)
    isDraggingV = false
  }

  // H scrollbar drag handlers
  const startHDragging = e => {
    e.preventDefault()
    initialMouse = getLocation(e).x
    initialScroll = $scrollLeft
    document.addEventListener("mousemove", moveHDragging)
    document.addEventListener("touchmove", moveHDragging)
    document.addEventListener("mouseup", stopHDragging)
    document.addEventListener("touchend", stopHDragging)
    isDraggingH = true
    closeMenu()
  }
  const moveHDragging = domDebounce(e => {
    const delta = getLocation(e).x - initialMouse
    const weight = delta / availWidth
    const newScrollLeft = initialScroll + weight * $maxScrollLeft
    scroll.update(state => ({
      ...state,
      left: Math.max(0, Math.min(newScrollLeft, $maxScrollLeft)),
    }))
  })
  const stopHDragging = () => {
    document.removeEventListener("mousemove", moveHDragging)
    document.removeEventListener("touchmove", moveHDragging)
    document.removeEventListener("mouseup", stopHDragging)
    document.removeEventListener("touchend", stopHDragging)
    isDraggingH = false
  }
</script>

{#if $showVScrollbar}
  <div
    class="v-scrollbar"
    style="--size:{ScrollBarSize}px; top:{barTop}px; height:{barHeight}px;"
    on:mousedown={startVDragging}
    on:touchstart={startVDragging}
    class:dragging={isDraggingV}
  />
{/if}
{#if $showHScrollbar}
  <div
    class="h-scrollbar"
    style="--size:{ScrollBarSize}px; left:{barLeft}px; width:{barWidth}px;"
    on:mousedown={startHDragging}
    on:touchstart={startHDragging}
    class:dragging={isDraggingH}
  />
{/if}

<style>
  div {
    position: absolute;
    background: var(--spectrum-global-color-gray-500);
    opacity: 0.5;
    border-radius: 4px;
    transition: opacity 130ms ease-out;
  }
  div:hover,
  div.dragging {
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
