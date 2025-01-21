<script>
  import { getContext } from "svelte"
  import { domDebounce } from "../../../utils/utils"

  const {
    rowHeight,
    scroll,
    ui,
    renderedRows,
    maxScrollTop,
    maxScrollLeft,
    bounds,
    hoveredRowId,
    menu,
    focusedCellAPI,
    scrollTop,
    scrollLeft,
  } = getContext("grid")

  export let scrollVertically = false
  export let scrollHorizontally = false
  export let attachHandlers = false
  export let ref

  // Used for tracking touch events
  let initialTouchX
  let initialTouchY

  $: style = generateStyle($scrollLeft, $scrollTop, $rowHeight)

  const generateStyle = (scrollLeft, scrollTop, rowHeight) => {
    const offsetX = scrollHorizontally ? -1 * scrollLeft : 0
    const offsetY = scrollVertically ? -1 * (scrollTop % rowHeight) : 0
    return `transform: translate(${offsetX}px, ${offsetY}px);`
  }

  // Handles a mouse wheel event and updates scroll state
  const handleWheel = e => {
    e.preventDefault()
    updateScroll(e.deltaX, e.deltaY, e.clientY)

    // Close any open popovers when scrolling
    $focusedCellAPI?.blur()

    // If a context menu was visible, hide it
    if ($menu.visible) {
      menu.actions.close()
    }
  }

  // Handles touch start events
  const handleTouchStart = e => {
    if (!e.touches?.[0]) return
    initialTouchX = e.touches[0].clientX
    initialTouchY = e.touches[0].clientY
  }

  // Handles touch move events and updates scroll state
  const handleTouchMove = e => {
    if (!e.touches?.[0]) return
    e.preventDefault()

    // Compute delta from previous event, and update scroll
    const deltaX = initialTouchX - e.touches[0].clientX
    const deltaY = initialTouchY - e.touches[0].clientY
    updateScroll(deltaX, deltaY)

    // Store position to reference in next event
    initialTouchX = e.touches[0].clientX
    initialTouchY = e.touches[0].clientY

    // If a context menu was visible, hide it
    if ($menu.visible) {
      menu.actions.close()
    }
  }

  // Updates the scroll offset by a certain delta, and ensure scrolling
  // stays within sensible bounds. Debounced for performance.
  const updateScroll = domDebounce((deltaX, deltaY, clientY) => {
    const { top, left } = $scroll

    // Calculate new scroll top
    let newScrollTop = top + deltaY
    newScrollTop = Math.max(0, Math.min(newScrollTop, $maxScrollTop))

    // Calculate new scroll left
    let newScrollLeft = left + deltaX
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, $maxScrollLeft))

    // Update state
    scroll.set({
      left: scrollHorizontally ? newScrollLeft : left,
      top: scrollVertically ? newScrollTop : top,
    })

    // Hover row under cursor
    if (clientY != null) {
      const y = clientY - $bounds.top + (newScrollTop % $rowHeight)
      const hoveredRow = $renderedRows[Math.floor(y / $rowHeight)]
      hoveredRowId.set(hoveredRow?._id)
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="outer"
  on:wheel={attachHandlers ? handleWheel : null}
  on:touchstart={attachHandlers ? handleTouchStart : null}
  on:touchmove={attachHandlers ? handleTouchMove : null}
  on:click|self={ui.actions.blur}
>
  <div {style} class="inner" bind:this={ref}>
    <slot />
  </div>
</div>

<style>
  .outer {
    min-width: 100%;
    min-height: 100%;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .inner {
    position: absolute;
  }
</style>
