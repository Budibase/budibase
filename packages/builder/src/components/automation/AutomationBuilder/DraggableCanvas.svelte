<script>
  import { writable } from "svelte/store"
  import {
    setContext,
    onMount,
    createEventDispatcher,
    onDestroy,
    tick,
  } from "svelte"
  import { Utils } from "@budibase/frontend-core"
  import { selectedAutomation, automationStore } from "stores/builder"
  import { memo } from "@budibase/frontend-core"

  const getContentTransformOrigin = () => {
    const midPoint = {
      midX: viewPort.getBoundingClientRect().width / 2,
      midY: viewPort.getBoundingClientRect().height / 2,
    }
    return [
      Math.abs(midPoint.midX - $contentPos.x),
      Math.abs(midPoint.midY - $contentPos.y),
    ]
  }

  // TODO - Remove Debugging
  window.markCenterPoint = async () => {
    zoomOrigin = [...getContentTransformOrigin()]

    const scale = 1 //0.9

    const newWidth = contentDims.w * scale
    const deltaWidth = contentDims.w - newWidth

    const newHeight = contentDims.h * scale
    const deltaHeight = contentDims.h - newHeight

    console.log({
      w: {
        widf: contentDims.w,
        newWidth,
        deltaWidth: parseInt(deltaWidth),
      },
      h: {
        hif: contentDims.h,
        newHeight,
        deltaHeight: parseInt(deltaHeight),
      },
    })
  }

  export function toFocus() {
    viewToFocusEle()
  }

  export function zoomIn() {
    const scale = parseFloat(Math.min($view.scale + 0.1, 1.5).toFixed(2))
    // zoomOrigin = [...getContentTransformOrigin()]

    view.update(state => ({
      ...state,
      scale,
    }))
  }

  export function zoomOut() {
    const scale = parseFloat(Math.max($view.scale - 0.1, 0.1).toFixed(2))
    // zoomOrigin = [...getContentTransformOrigin()]

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
    dragOffset = []
    contentPos.update(state => ({
      ...state,
      x: 0,
      y: 0,
    }))
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

  $: if ($view || contentDims) {
    window.testValues = { ...$view, contentDims }
  }

  // Elements
  let mainContent
  let viewPort
  let contentWrap

  // Mouse down
  let down = false

  // Monitor the size of the viewPort
  let viewObserver

  // Monitor the size of the content
  // Always reconfigure when changes occur
  let contentObserver

  // Size of the core display content
  let contentDims = {}

  // Size of the view port
  let viewDims = {}

  // When dragging the content, maintain the drag start offset
  let dragOffset = []

  // Edge around the draggable content
  let contentDragPadding = 200

  // Auto scroll
  let scrollInterval

  let zoomOrigin = []

  // Focus element details. Used to move the viewport
  let focusElement = memo()

  // Memo Focus
  $: focusElement.set($view.focusEle)

  const onScale = async () => {
    dispatch("zoom", $view.scale)
    await getDims()
  }

  const getDims = async () => {
    if (!contentDims.original) {
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

  const buildWrapStyles = (pos, scale, dims, contentCursor) => {
    const { x, y } = pos
    const { w, h } = dims
    const [cursorContentX, cursorContentY] = contentCursor
    return `
      --posX: ${x}px; --posY: ${y}px; 
      --scale: ${scale}; 
      --wrapH: ${h}px; --wrapW: ${w}px;
      --ccX: ${cursorContentX}px;
      --ccY: ${cursorContentY}px;
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

    if (down && !$view.dragging && dragOffset) {
      contentPos.update(state => ({
        ...state,
        x: x - dragOffset[0],
        y: y - dragOffset[1],
      }))
    }

    const clearScrollInterval = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = undefined
      }
    }

    if ($view.dragging) {
      // Need to know the internal offset as well.
      const scrollZones = {
        top: y < viewDims.height * 0.05,
        bottom:
          y > viewDims.height - ($view.moveStep.h - $view.moveStep.mouse.y),
        left: x < viewDims.width * 0.05,
        right: x > viewDims.width - $view.moveStep.w,
      }

      // Determine which zones are currently in play
      const dragOutEntries = Object.entries(scrollZones).filter(e => e[1])
      if (dragOutEntries.length) {
        const dragOut = Object.fromEntries(dragOutEntries)

        if (!scrollInterval) {
          const autoScroll = () => {
            // Some internal tracking for implying direction
            // const lastY = $contentPos.y
            // const lastX = $contentPos.x
            const bump = 30

            // Depending on the zone, you want to move the content
            // in the opposite direction
            const xInterval = dragOut.right ? -bump : dragOut.left ? bump : 0
            const yInterval = dragOut.bottom ? -bump : dragOut.top ? bump : 0

            return () => {
              contentPos.update(state => ({
                ...state,
                x: (state.x || 0) + xInterval,
                y: (state.y || 0) + yInterval,
                scrollX: state.scrollX + xInterval,
                scrollY: state.scrollY + yInterval,
              }))
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
    dragOffset = [0, 0]
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
  const globalMouseUp = e => {
    down = false

    if ($view.dragging) {
      dragOffset = [0, 0]
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
    if ($view.droptarget) {
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
    // Update viewDims to get the latest viewport dimensions
    viewDims = viewPort.getBoundingClientRect()

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

  const onMoveContent = e => {
    if (down || !viewPort) {
      return
    }
    const { x, y } = eleXY(e, viewPort)

    dragOffset = [Math.abs(x - $contentPos.x), Math.abs(y - $contentPos.y)]
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
  $: wrapStyles = buildWrapStyles(
    $contentPos,
    $view.scale,
    contentDims,
    zoomOrigin
  )

  onMount(() => {
    viewObserver = new ResizeObserver(getDims)
    viewObserver.observe(viewPort)

    contentObserver = new ResizeObserver(getDims)
    contentObserver.observe(mainContent)

    // Global mouse observer
    document.addEventListener("mouseup", globalMouseUp)
  })

  onDestroy(() => {
    viewObserver.disconnect()
    contentObserver.disconnect()
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
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    class="draggable-view"
    bind:this={viewPort}
    on:wheel={Utils.domDebounce(onViewScroll)}
    on:mousemove={Utils.domDebounce(onViewMouseMove)}
    on:mouseup={onViewDragEnd}
  >
    <!--delete me-->
    <div class="reticle" />
    <div class="debug">
      <span>
        View Pos [{$internalPos.x}, {$internalPos.y}]
      </span>
      <span>View Dims [{viewDims.width}, {viewDims.height}]</span>
      <span>Mouse Down [{down}]</span>
      <span>Drag [{$view.dragging}]</span>
      <span>Dragging [{$view?.moveStep?.id || "no"}]</span>
      <span>Scale [{$view.scale}]</span>
      <span>Content [{JSON.stringify($contentPos)}]</span>
      <span>Content Cursor [{JSON.stringify(dragOffset)}]</span>
    </div>
    <div
      class="content-wrap"
      style={wrapStyles}
      bind:this={contentWrap}
      class:dragging={down}
    >
      <!--delete me-->
      <div class="reticle-content" />
      <div
        class="content"
        bind:this={mainContent}
        on:mousemove={Utils.domDebounce(onMoveContent)}
        on:mousedown={e => {
          if (e.which === 1 || e.button === 0) {
            down = true
          }
        }}
        on:mouseup={e => {
          if (e.which === 1 || e.button === 0) {
            down = false
          }
        }}
      >
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
  }

  .reticle {
    display: none;
    z-index: 10000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 2px;
    background-color: red;
    border-radius: 50%;
  }

  .reticle-content {
    z-index: 10000;
    position: absolute;
    top: var(--ccY);
    left: var(--ccX);
    width: 2px;
    height: 2px;
    background-color: greenyellow;
    border-radius: 50%;
  }

  .content {
    transform-origin: var(--ccX) var(--ccY);
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
    cursor: grab;
    transform: translate(var(--posX), var(--posY));
  }

  .content-wrap.dragging {
    cursor: grabbing;
  }

  .debug {
    display: flex;
    align-items: center;
    gap: 8px;
    position: fixed;
    padding: var(--spacing-l);
    z-index: 2;
    pointer-events: none;
  }
</style>
