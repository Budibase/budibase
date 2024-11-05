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

  export function zoomIn() {
    const scale = Number(Math.min($view.scale + 0.1, 1.5).toFixed(2))
    view.update(state => ({
      ...state,
      scale,
    }))
  }

  export function zoomOut() {
    const scale = Number(Math.max($view.scale - 0.1, 0).toFixed(2))
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

    const scaleTarget = Math.min(
      wViewPort / contentDims.original.w,
      hViewPort / contentDims.original.h
    )

    // Smallest ratio determines which dimension needs squeezed
    view.update(state => ({
      ...state,
      scale: scaleTarget,
    }))

    await tick()

    const adjustedY = (hViewPort - contentDims.original.h) / 2

    contentPos.update(state => ({
      ...state,
      x: 0,
      y: parseInt(0 + adjustedY),
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
    //focus - node to center on?
  })

  setContext("draggableView", view)

  // View internal pos tracking
  const internalPos = writable({ x: 0, y: 0 })
  setContext("viewPos", internalPos)

  // Content pos tracking
  const contentPos = writable({ x: 0, y: 0, scrollX: 0, scrollY: 0 })
  setContext("contentPos", contentPos)

  // Elements
  let mainContent
  let viewPort
  let contentWrap

  // Mouse down
  let down = false

  // Monitor the size of the viewPort
  let observer

  // Size of the core display content
  let contentDims = {}

  // Size of the view port
  let viewDims = {}

  // When dragging the content, maintain the drag start offset
  let dragOffset

  // Used when focusing the UI on trigger
  let loaded = false

  // Edge around the draggable content
  let contentDragPadding = 200

  const onScale = async () => {
    dispatch("zoom", $view.scale)
    await getDims()
  }

  const getDims = async () => {
    if (!mainContent) return

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

  const buildWrapStyles = (pos, scale, dims) => {
    const { x, y } = pos
    const { w, h } = dims
    return `--posX: ${x}px; --posY: ${y}px; --scale: ${scale}; --wrapH: ${h}px; --wrapW: ${w}px`
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
        updatedScale = Math.max(0, currentScale - 0.05)
      }

      view.update(state => ({
        ...state,
        scale: Number(updatedScale.toFixed(2)),
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

  const focusOnLoad = () => {
    if ($view.focusEle && !loaded) {
      const focusEleDims = $view.focusEle
      const viewWidth = viewDims.width

      // The amount to shift the content in order to center the trigger on load.
      // The content is also padded with `contentDragPadding`
      // The sidebar offset factors into the left positioning of the content here.
      const targetX =
        contentWrap.getBoundingClientRect().x -
        focusEleDims.x +
        (viewWidth / 2 - focusEleDims.width / 2)

      // Update the content position state
      // Shift the content up slightly to accommodate the padding
      contentPos.update(state => ({
        ...state,
        x: targetX,
        y: -(contentDragPadding / 2),
      }))

      loaded = true
    }
  }

  // Update dims after scaling
  $: {
    $view.scale
    onScale()
  }

  // Focus on a registered element
  $: {
    $view.focusEle
    focusOnLoad()
  }

  // Content mouse pos and scale to css variables.
  // The wrap is set to match the content size
  $: wrapStyles = buildWrapStyles($contentPos, $view.scale, contentDims)

  onMount(() => {
    observer = new ResizeObserver(getDims)
    observer.observe(viewPort)
  })

  onDestroy(() => {
    observer.disconnect()
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
  <div
    class="draggable-view"
    bind:this={viewPort}
    on:wheel={Utils.domDebounce(onViewScroll)}
    on:mousemove={Utils.domDebounce(onViewMouseMove)}
    on:mouseup={onViewDragEnd}
    on:mouseleave={onViewDragEnd}
  >
    <!-- <div class="debug">
      <span>
        View Pos [{$internalPos.x}, {$internalPos.y}]
      </span>
      <span>View Dims [{viewDims.width}, {viewDims.height}]</span>
      <span>Mouse Down [{down}]</span>
      <span>Drag [{$view.dragging}]</span>
      <span>Dragging [{$view?.moveStep?.id || "no"}]</span>
      <span>Scale [{$view.scale}]</span>
      <span>Content [{JSON.stringify($contentPos)}]</span>
    </div> -->
    <div
      class="content-wrap"
      style={wrapStyles}
      bind:this={contentWrap}
      class:dragging={down}
    >
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
        on:mouseleave={() => {
          down = false
          view.update(state => ({
            ...state,
            dragging: false,
            moveStep: null,
            dragSpot: null,
            dropzones: {},
          }))
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
  .content {
    transform: scale(var(--scale));
    user-select: none;
    padding: var(--dragPadding);
  }

  .content-wrap.dragging {
    cursor: grabbing;
  }

  /* .debug {
    display: flex;
    align-items: center;
    gap: 8px;
    position: fixed;
    padding: 8px;
    z-index: 2;
  } */
</style>
