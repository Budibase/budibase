<script>
  import { onDestroy, tick } from "svelte"
  import { writable } from "svelte/store"
  import { setContext, onMount, createEventDispatcher } from "svelte"
  import { Utils } from "@budibase/frontend-core"
  import { selectedAutomation, automationStore } from "stores/builder"

  export function zoomIn() {
    const scale = Number(Math.min($view.scale + 0.1, 1).toFixed(2))
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
    dragging: false,
    scale: 1,
    dropzones: {},
    //focus - node to center on?
  })

  setContext("view", view)

  // View internal pos tracking
  const internalPos = writable({ x: 0, y: 0 })
  setContext("viewPos", internalPos)

  // Content pos tracking
  const contentPos = writable({ x: 0, y: 0 })
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

  // Auto scroll
  let scrollInterval

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
      }))
    } else if (e.ctrlKey || e.metaKey) {
      // Scale
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
      }))
    }
  }

  // Optimization options
  const onViewMouseMove = async e => {
    const { x, y } = eleXY(e, viewPort)

    internalPos.update(() => ({
      x,
      y,
    }))

    if (down && !$view.dragging) {
      contentPos.update(state => ({
        ...state,
        x: x - dragOffset[0],
        y: y - dragOffset[1],
      }))
    }

    // Needs to handle when the mouse leaves the screen
    // Needs to know the direction of movement and accelerate/decelerate
    if (y < (viewDims.height / 100) * 20 && $view.dragging) {
      if (!scrollInterval) {
        // scrollInterval = setInterval(() => {
        //   contentPos = { x: contentPos.x, y: contentPos.y + 35 }
        // }, 100)
      }
    } else {
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = undefined
      }
    }
  }

  const onViewDragEnd = e => {
    down = false
    dragOffset = []
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
  }

  const onMouseMove = async e => {
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
      // TODO - Need to adjust content pos
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
    if (down) {
      return
    }
    const { x, y } = eleXY(e, viewPort)

    dragOffset = [Math.abs(x - $contentPos.x), Math.abs(y - $contentPos.y)]
  }

  // Update dims after scaling
  $: {
    $view.scale
    onScale()
  }

  // Content mouse pos and scale to css variables.
  // The wrap is set to match the content size
  $: wrapStyles = buildWrapStyles($contentPos, $view.scale, contentDims)

  onMount(() => {
    observer = new ResizeObserver(entries => {
      if (!entries?.[0]) {
        return
      }
      getDims()
    })
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
>
  <div
    class="view"
    bind:this={viewPort}
    on:wheel={Utils.domDebounce(onViewScroll)}
    on:mousemove={Utils.domDebounce(onViewMouseMove)}
    on:mouseup={onViewDragEnd}
    on:mouseleave={onViewDragEnd}
  >
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
            dragging: false,
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
  .view {
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
  }
  .content {
    /* transition: all 0.1s ease-out; */
    transform: translate(var(--posX), var(--posY)) scale(var(--scale));
    user-select: none;
    padding: 200px;
    padding-top: 200px;
  }

  .content-wrap.dragging {
    cursor: grabbing;
  }
</style>
