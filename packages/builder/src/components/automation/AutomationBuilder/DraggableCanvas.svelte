<script>
  import { writable } from "svelte/store"
  import {
    setContext,
    onMount,
    createEventDispatcher,
    onDestroy,
    tick,
  } from "svelte"
  import Logo from "assets/bb-emblem.svg?raw"
  import { Utils, memo } from "@budibase/frontend-core"
  import { selectedAutomation, automationStore } from "@/stores/builder"

  // CSS classes that, on mouse down, will trigger the view drag behaviour
  export let draggableClasses = []

  export function toFocus() {
    viewToFocusEle()
  }

  export async function zoomIn() {
    const newScale = parseFloat(Math.min($view.scale + 0.1, 1.5).toFixed(2))
    if ($view.scale === 1.5) return

    view.update(state => ({
      ...state,
      scale: newScale,
    }))
  }

  export function zoomOut() {
    const scale = parseFloat(Math.max($view.scale - 0.1, 0.1).toFixed(2))
    if ($view.scale === 0.1) return

    view.update(state => ({
      ...state,
      scale,
    }))
  }

  export async function reset() {
    contentDims = {
      ...contentDims,
      w: contentDims.original.w,
      h: contentDims.original.h,
    }
    contentPos.update(state => ({
      ...state,
      x: 0,
      y: 0,
    }))
    offsetX = 0
    offsetY = 0
    view.update(state => ({
      ...state,
      scale: 1,
    }))
  }

  export async function zoomToFit() {
    const { width: wViewPort, height: hViewPort } =
      viewPort.getBoundingClientRect()

    const scaleTarget = parseFloat(
      Math.min(
        wViewPort / contentDims.original.w,
        hViewPort / contentDims.original.h
      ).toFixed(2)
    )

    // Skip behaviour if the scale target scale is the current scale
    if ($view.scale !== scaleTarget) {
      // Smallest ratio determines which dimension needs squeezed
      view.update(state => ({
        ...state,
        scale: parseFloat(scaleTarget.toFixed(2)),
      }))

      await tick()
    }

    const adjustedY = (hViewPort - contentDims.original.h) / 2

    contentPos.update(state => ({
      ...state,
      x: 0,
      y: parseInt(0 + adjustedY),
      scrollX: 0,
      scrollY: 0,
    }))
    offsetY = parseInt(0 + adjustedY)
  }

  const dispatch = createEventDispatcher()

  // View State
  const view = writable({
    dragging: false,
    moveStep: null,
    dragSpot: null,
    scale: 1,
    dropzones: {},
  })

  setContext("draggableView", view)

  // View internal pos tracking
  const internalPos = writable({ x: 0, y: 0 })
  setContext("viewPos", internalPos)

  // Content pos tracking
  const contentPos = writable({
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
  })
  setContext("contentPos", contentPos)

  // Elements
  let mainContent
  let viewPort
  let contentWrap

  // Mouse down
  let down = false

  // Monitor the size of the viewPort
  let viewObserver

  // Size of the core display content
  let contentDims = {}

  // Size of the view port
  let viewDims = {}

  // Edge around the draggable content
  let contentDragPadding = 200

  // Auto scroll
  let scrollInterval

  // Used to track where the draggable item is scrolling into
  let scrollZones

  // Used to track the movements of the dragged content
  // This allows things like the background to have their own starting coords
  let offsetX = 0
  let offsetY = 0

  // Focus element details. Used to move the viewport
  let focusElement = memo()

  // Memo Focus
  $: focusElement.set($view.focusEle)

  // Background pattern
  let bgDim = 24

  // Scale prop for the icon
  let dotDefault = 0.006

  let viewDragStart = { x: 0, y: 0 }
  let viewDragOffset = [0, 0]
  let startPos = [0, 0]

  $: bgSize = Math.max(bgDim * $view.scale, 10)
  $: bgWidth = bgSize
  $: bgHeight = bgSize
  $: dotSize = Math.max(dotDefault * $view.scale, dotDefault)

  const onScale = async () => {
    dispatch("zoom", $view.scale)
    await getDims()
  }

  const getDims = async (forceRefresh = false) => {
    if (!mainContent || !viewPort) {
      return
    }
    if (!contentDims.original || (contentDims.original && forceRefresh)) {
      contentDims.original = {
        w: parseInt(mainContent.getBoundingClientRect().width),
        h: parseInt(mainContent.getBoundingClientRect().height),
      }
    }

    viewDims = viewPort.getBoundingClientRect()

    contentDims = {
      ...contentDims,
      w: contentDims.original.w * $view.scale,
      h: contentDims.original.h * $view.scale,
    }
  }

  const eleXY = (coords, ele) => {
    const { clientX, clientY } = coords
    const rect = ele.getBoundingClientRect()
    const x = Math.round(clientX - rect.left)
    const y = Math.round(clientY - rect.top)
    return { x: Math.max(x, 0), y: Math.max(y, 0) }
  }

  const buildWrapStyles = (pos, scale, dims) => {
    const { x, y } = pos
    const { w, h } = dims
    return `
      --posX: ${x}px; --posY: ${y}px; 
      --scale: ${scale}; 
      --wrapH: ${h}px; --wrapW: ${w}px;
      `
  }

  const onViewScroll = e => {
    e.preventDefault()
    let currentScale = $view.scale
    let scrollIncrement = 35
    let xBump = 0
    let yBump = 0

    if (e.shiftKey) {
      // Scroll horizontal - Needs Limits
      xBump = scrollIncrement * (e.deltaX < 0 ? -1 : 1)
      contentPos.update(state => ({
        ...state,
        x: state.x - xBump,
        y: state.y,
        // If scrolling *and* dragging, maintain a record of the scroll offset
        ...($view.dragging
          ? {
              scrollX: state.scrollX - xBump,
            }
          : {}),
      }))

      offsetX = offsetX - xBump
    } else if (e.ctrlKey || e.metaKey) {
      // Scale the content on scrolling
      let updatedScale
      if (e.deltaY < 0) {
        updatedScale = Math.min(1, currentScale + 0.05)
      } else if (e.deltaY > 0) {
        updatedScale = Math.max(0.1, currentScale - 0.05)
      }

      view.update(state => ({
        ...state,
        scale: parseFloat(updatedScale.toFixed(2)),
      }))
    } else {
      yBump = scrollIncrement * (e.deltaY < 0 ? -1 : 1)
      contentPos.update(state => ({
        ...state,
        x: state.x,
        y: state.y - yBump,
        // If scrolling *and* dragging, maintain a record of the scroll offset
        ...($view.dragging
          ? {
              scrollY: state.scrollY - yBump,
            }
          : {}),
      }))
      offsetY = offsetY - yBump
    }
  }

  // Optimization options
  const onViewMouseMove = async e => {
    if (!viewPort) {
      return
    }

    const { x, y } = eleXY(e, viewPort)

    internalPos.update(() => ({
      x,
      y,
    }))

    if (down && !$view.dragging) {
      // Determine how much the view has moved since
      viewDragOffset = [x - viewDragStart.x, y - viewDragStart.y]

      contentPos.update(state => ({
        ...state,
        x: startPos[0] + viewDragOffset[0],
        y: startPos[1] + viewDragOffset[1],
      }))
      offsetX = startPos[0] + viewDragOffset[0]
      offsetY = startPos[1] + viewDragOffset[1]
    }

    const clearScrollInterval = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = undefined
      }
    }

    if ($view.dragging) {
      // Static, default buffer centered around the mouse
      const dragBuffer = 100

      scrollZones = {
        top: y < dragBuffer,
        bottom: y > viewDims.height - dragBuffer,
        left: x < dragBuffer,
        // An exception for the right side as the drag handle is on the extreme left
        right: x > viewDims.width - $view.moveStep.w,
      }

      // Determine which zones are currently in play
      const dragOutEntries = Object.entries(scrollZones).filter(e => e[1])
      if (dragOutEntries.length) {
        if (!scrollInterval) {
          const autoScroll = () => {
            const bump = 30

            return () => {
              const dragOutEntries = Object.entries(scrollZones).filter(
                e => e[1]
              )
              const dragOut = Object.fromEntries(dragOutEntries)

              // Depending on the zone, you want to move the content
              // in the opposite direction
              const xInterval = dragOut.right ? -bump : dragOut.left ? bump : 0
              const yInterval = dragOut.bottom ? -bump : dragOut.top ? bump : 0

              contentPos.update(state => ({
                ...state,
                x: (state.x || 0) + xInterval,
                y: (state.y || 0) + yInterval,
                scrollX: state.scrollX + xInterval,
                scrollY: state.scrollY + yInterval,
              }))
              offsetX = offsetX + xInterval
              offsetY = offsetY + yInterval
            }
          }

          scrollInterval = setInterval(autoScroll(), 30)
        }
      } else {
        clearScrollInterval()
      }
    } else {
      clearScrollInterval()
    }
  }

  const onViewDragEnd = () => {
    down = false
  }

  const handleDragDrop = () => {
    const sourceBlock = $selectedAutomation.blockRefs[$view.moveStep.id]
    const sourcePath = sourceBlock.pathTo

    const dropZone = $view.dropzones[$view.droptarget]
    const destPath = dropZone?.path

    automationStore.actions.moveBlock(
      sourcePath,
      destPath,
      $selectedAutomation.data
    )
  }

  // Reset state on mouse up
  const globalMouseUp = () => {
    down = false

    viewDragStart = { x: 0, y: 0 }
    viewDragOffset = [0, 0]

    if ($view.dragging) {
      view.update(state => ({
        ...state,
        dragging: false,
        moveStep: null,
        dragSpot: null,
        dropzones: {},
        droptarget: null,
      }))

      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = undefined
        scrollZones = {}
      }

      // Clear the scroll offset for dragging
      contentPos.update(state => ({
        ...state,
        scrollY: 0,
        scrollX: 0,
      }))
    }
  }

  const onMouseUp = () => {
    if ($view.droptarget && $view.dragging) {
      handleDragDrop()
    }

    view.update(state => ({
      ...state,
      dragging: false,
      moveStep: null,
      dragSpot: null,
      dropzones: {},
      droptarget: null,
    }))

    // Clear the scroll offset for dragging
    contentPos.update(state => ({
      ...state,
      scrollY: 0,
      scrollX: 0,
    }))
  }

  const onMouseMove = async e => {
    if (!viewPort) {
      return
    }

    if ($view.moveStep && $view.dragging === false) {
      view.update(state => ({
        ...state,
        dragging: true,
      }))
    }

    const checkIntersection = (pos, dzRect) => {
      return (
        pos.x < dzRect.right &&
        pos.x > dzRect.left &&
        pos.y < dzRect.bottom &&
        pos.y > dzRect.top
      )
    }

    if ($view.dragging) {
      const adjustedX =
        (e.clientX - viewDims.left - $view.moveStep.offsetX) / $view.scale
      const adjustedY =
        (e.clientY - viewDims.top - $view.moveStep.offsetY) / $view.scale

      view.update(state => ({
        ...state,
        dragSpot: {
          x: adjustedX,
          y: adjustedY,
        },
      }))
    }

    if ($view.moveStep && $view.dragging) {
      let hovering = false
      Object.entries($view.dropzones).forEach(entry => {
        const [dzKey, dz] = entry
        if (checkIntersection({ x: e.clientX, y: e.clientY }, dz.dims)) {
          hovering = true
          view.update(state => ({
            ...state,
            droptarget: dzKey,
          }))
        }
      })
      // Ensure that when it stops hovering, it clears the drop target
      if (!hovering) {
        view.update(state => ({
          ...state,
          droptarget: null,
        }))
      }
    }
  }

  const isDraggable = e => {
    const draggable = ["draggable-view", ...draggableClasses]
    return draggable.some(cls => e.target.classList.contains(cls))
  }

  const viewToFocusEle = () => {
    if ($focusElement) {
      const viewWidth = viewDims.width

      // The amount to shift the content in order to center the trigger on load.
      // The content is also padded with `contentDragPadding`
      // The sidebar offset factors into the left positioning of the content here.
      const targetX =
        contentWrap.getBoundingClientRect().x -
        $focusElement.x +
        (viewWidth / 2 - $focusElement.width / 2)

      // Update the content position state
      // Shift the content up slightly to accommodate the padding
      contentPos.update(state => ({
        ...state,
        x: targetX,
        y: -(contentDragPadding / 2),
      }))
    }
  }

  // Update dims after scaling
  $: viewScale = $view.scale
  $: if (viewScale && mainContent) {
    onScale()
  }

  // Focus on a registered element
  $: {
    $focusElement
    viewToFocusEle()
  }

  // Content mouse pos and scale to css variables.
  // The wrap is set to match the content size
  $: wrapStyles = buildWrapStyles($contentPos, $view.scale, contentDims)

  onMount(() => {
    // As the view/browser resizes, ensure the stored view is up to date
    viewObserver = new ResizeObserver(
      Utils.domDebounce(() => {
        getDims()
      })
    )
    viewObserver.observe(viewPort)

    // Global mouse observer
    document.addEventListener("mouseup", globalMouseUp)
  })

  onDestroy(() => {
    viewObserver.disconnect()
    document.removeEventListener("mouseup", globalMouseUp)
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  class="draggable-canvas"
  role="region"
  aria-label="Viewport for building automations"
  on:mouseup={onMouseUp}
  on:mousemove={Utils.domDebounce(onMouseMove)}
  style={`--dragPadding: ${contentDragPadding}px;`}
>
  <svg class="draggable-background" style={`--dotSize: ${dotSize};`}>
    <!-- Small 2px offset to tuck the points under the viewport on load-->
    <pattern
      id="dot-pattern"
      width={bgWidth}
      height={bgHeight}
      patternUnits="userSpaceOnUse"
      patternTransform={`translate(${offsetX - 2}, ${offsetY - 2})`}
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html Logo}
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
  </svg>

  <div
    class="draggable-view"
    class:dragging={down}
    bind:this={viewPort}
    on:wheel={Utils.domDebounce(onViewScroll)}
    on:mousemove={Utils.domDebounce(onViewMouseMove)}
    on:mousedown={e => {
      if ((e.which === 1 || e.button === 0) && isDraggable(e)) {
        const { x, y } = eleXY(e, viewPort)
        viewDragStart = { x, y }
        startPos = [$contentPos.x, $contentPos.y]
        down = true
      }
    }}
    on:mouseup={e => {
      viewDragOffset = [0, 0]
      if ((e.which === 1 || e.button === 0) && isDraggable(e)) {
        down = false
      }
      onViewDragEnd()
    }}
  >
    <div class="content-wrap" style={wrapStyles} bind:this={contentWrap}>
      <div class="content" bind:this={mainContent}>
        <slot name="content" />
      </div>
    </div>
  </div>
</div>

<style>
  .draggable-canvas {
    width: 100%;
    height: 100%;
  }
  .draggable-view {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    cursor: grab;
  }
  .draggable-view.dragging {
    cursor: grabbing;
  }

  .content {
    transform-origin: 50% 50%;
    transform: scale(var(--scale));
    user-select: none;
    padding: var(--dragPadding);
  }

  .content-wrap {
    min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: var(--wrapW);
    height: var(--wrapH);
    transform: translate(var(--posX), var(--posY));
  }

  .draggable-background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1;
    background-color: var(--spectrum-global-color-gray-50);
  }

  .draggable-background :global(svg g path) {
    fill: #91919a;
  }

  .draggable-background :global(svg g) {
    transform: scale(var(--dotSize));
  }
</style>
