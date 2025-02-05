<script>
  import { onDestroy, getContext } from "svelte"
  import { builderStore, componentStore, screenStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"
  import { GridRowHeight } from "constants"
  import { GridParams, getGridVar, Devices } from "utils/grid"

  const context = getContext("context")

  // Smallest possible 1x1 transparent GIF
  const ghost = new Image(1, 1)
  ghost.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

  let dragInfo
  let styles = memo()

  $: placeholderID = findPlaceholderID($screenStore.activeScreen)
  $: handleNewPlaceholderID(placeholderID)

  // Grid CSS variables
  $: device = $context.device.mobile ? Devices.Mobile : Devices.Desktop
  $: vars = {
    colStart: getGridVar(device, GridParams.ColStart),
    colEnd: getGridVar(device, GridParams.ColEnd),
    rowStart: getGridVar(device, GridParams.RowStart),
    rowEnd: getGridVar(device, GridParams.RowEnd),
  }

  // Some memoisation of primitive types for performance
  $: id = dragInfo?.id

  // Set ephemeral styles
  $: instance = componentStore.actions.getComponentInstance(id)
  $: $instance?.setEphemeralStyles($styles)

  const findPlaceholderID = screen => {
    return screen?.props?._children?.find(c => c._placeholder)?._id
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const handleNewPlaceholderID = async placeholderID => {
    if (!placeholderID) {
      stopDragging()
      return
    }
    await sleep(100)
    onDragStart(placeholderID)
  }

  // Sugar for a combination of both min and max
  const minMax = (value, min, max) => Math.min(max, Math.max(min, value))

  const processEvent = Utils.domDebounce((mouseX, mouseY) => {
    if (!dragInfo?.grid) {
      return
    }
    const { grid, domGrid } = dragInfo
    const { startX, startY, rowStart, rowEnd, colStart, colEnd } = grid
    if (!domGrid) {
      return
    }
    const cols = parseInt(domGrid.dataset.cols)
    const colSize = parseInt(domGrid.dataset.colSize)
    const diffX = mouseX - startX
    let deltaX = Math.round(diffX / colSize)
    const diffY = mouseY - startY
    let deltaY = Math.round(diffY / GridRowHeight)
    deltaX = minMax(deltaX, 1 - colStart, cols + 1 - colEnd)
    deltaY = Math.max(deltaY, 1 - rowStart)
    const newStyles = {
      [vars.colStart]: colStart + deltaX,
      [vars.colEnd]: colEnd + deltaX,
      [vars.rowStart]: rowStart + deltaY,
      [vars.rowEnd]: rowEnd + deltaY,
      opacity: 1,
    }
    styles.set(newStyles)
  })

  const handleEvent = e => {
    e.preventDefault()
    e.stopPropagation()
    processEvent(e.clientX, e.clientY)
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = id => {
    console.log("DRAG START", id)
    // Find grid parent and read from DOM
    const domComponent = document.getElementsByClassName(id)[0]
    const domGrid = domComponent?.closest(".grid")
    if (!domGrid) {
      return
    }
    const styles = getComputedStyle(domComponent)
    const bounds = domComponent.getBoundingClientRect()

    // Show as active
    domComponent.classList.add("dragging")
    domGrid.classList.add("highlight")
    builderStore.actions.selectComponent(id)

    // Update state
    dragInfo = {
      domComponent,
      domGrid,
      id,
      gridId: domGrid.parentNode.dataset.id,
      grid: {
        startX: bounds.left + bounds.width / 2,
        startY: bounds.top + bounds.height / 2,
        rowStart: parseInt(styles["grid-row-start"]),
        rowEnd: parseInt(styles["grid-row-end"]),
        colStart: parseInt(styles["grid-column-start"]),
        colEnd: parseInt(styles["grid-column-end"]),
      },
    }

    // Add event handler to clear all drag state when dragging ends
    document.addEventListener("dragover", onDrag, false)

    // Add event handler to clear all drag state when dragging ends
    document.addEventListener("dragEnd", stopDragging, false)
    document.addEventListener("drop", stopDragging, false)
  }

  const onDrag = e => {
    if (!dragInfo) {
      return
    }
    handleEvent(e)
  }

  // Callback when drag stops (whether dropped or not)
  const stopDragging = async () => {
    if (!dragInfo) {
      return
    }
    console.log("END")
    const { id, domGrid, domComponent } = dragInfo

    // Reset DOM
    domComponent.classList.remove("dragging")
    domGrid.classList.remove("highlight")
    document.removeEventListener("dragover", onDrag, false)
    document.removeEventListener("dragend", stopDragging, false)
    document.removeEventListener("drop", stopDragging, false)

    // Save changes
    if ($styles) {
      builderStore.actions.updateStyles($styles, id)
    }

    // Reset state
    dragInfo = null
    styles.set(null)
  }

  onDestroy(() => {
    document.removeEventListener("dragover", onDrag, false)
    document.removeEventListener("dragend", stopDragging, false)
    document.removeEventListener("drop", stopDragging, false)
  })
</script>
