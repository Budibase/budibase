<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"
  import {
    isGridEvent,
    getGridParentID,
    GridParams,
    getGridVar,
  } from "utils/grid"

  // Smallest possible 1x1 transparent GIF
  const ghost = new Image(1, 1)
  ghost.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

  let dragInfo
  let gridStyles = memo()
  let id

  // Grid CSS variables
  $: device = $builderStore.previewDevice
  $: vars = {
    colStart: getGridVar(device, GridParams.ColStart),
    colEnd: getGridVar(device, GridParams.ColEnd),
    rowStart: getGridVar(device, GridParams.RowStart),
    rowEnd: getGridVar(device, GridParams.RowEnd),
  }

  // Some memoisation of primitive types for performance
  $: id = dragInfo?.id || id

  // Set ephemeral grid styles on the dragged component
  $: instance = componentStore.actions.getComponentInstance(id)
  $: componentStyles = getComponentStyles($gridStyles)
  $: $instance?.setEphemeralStyles(componentStyles)

  // Sugar for a combination of both min and max
  const minMax = (value, min, max) => Math.min(max, Math.max(min, value))

  // Util to get the inner DOM node by a component ID
  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component?.children][0]
  }

  const getComponentStyles = gridStyles => {
    let styles = { ...gridStyles }
    if (gridStyles) {
      styles["z-index"] = 999
      styles["pointer-events"] = "none"
    }
    return styles
  }

  const processEvent = Utils.throttle((mouseX, mouseY) => {
    if (!dragInfo?.grid) {
      return
    }

    const { mode, side, gridId, grid } = dragInfo
    const { startX, startY, rowStart, rowEnd, colStart, colEnd } = grid

    const domGrid = getDOMNode(gridId)
    const cols = parseInt(domGrid.dataset.cols)
    const rows = parseInt(domGrid.dataset.rows)
    const { width, height } = domGrid.getBoundingClientRect()

    const colWidth = width / cols
    const diffX = mouseX - startX
    let deltaX = Math.round(diffX / colWidth)
    const rowHeight = height / rows
    const diffY = mouseY - startY
    let deltaY = Math.round(diffY / rowHeight)
    if (mode === "move") {
      deltaX = minMax(deltaX, 1 - colStart, cols + 1 - colEnd)
      deltaY = minMax(deltaY, 1 - rowStart, rows + 1 - rowEnd)
      const newStyles = {
        [vars.colStart]: colStart + deltaX,
        [vars.colEnd]: colEnd + deltaX,
        [vars.rowStart]: rowStart + deltaY,
        [vars.rowEnd]: rowEnd + deltaY,
      }
      gridStyles.set(newStyles)
    } else if (mode === "resize") {
      let newStyles = {}
      if (side === "right") {
        newStyles[vars.colEnd] = Math.max(colEnd + deltaX, colStart + 1)
      } else if (side === "left") {
        newStyles[vars.colStart] = Math.min(colStart + deltaX, colEnd - 1)
      } else if (side === "top") {
        newStyles[vars.rowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "bottom") {
        newStyles[vars.rowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-right") {
        newStyles[vars.colEnd] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles[vars.rowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-left") {
        newStyles[vars.colStart] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles[vars.rowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "top-right") {
        newStyles[vars.colEnd] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles[vars.rowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "top-left") {
        newStyles[vars.colStart] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles[vars.rowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
      }
      gridStyles.set(newStyles)
    }
  }, 100)

  const handleEvent = e => {
    e.preventDefault()
    e.stopPropagation()
    processEvent(e.clientX, e.clientY)
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    if (!isGridEvent(e)) {
      return
    }

    // Hide drag ghost image
    e.dataTransfer.setDragImage(ghost, 0, 0)

    // Extract state
    let mode, id, side
    if (e.target.classList.contains("anchor")) {
      // Handle resize
      mode = "resize"
      id = e.target.dataset.id
      side = e.target.dataset.side
    } else {
      // Handle move
      mode = "move"
      const component = e.target.closest(".component")
      id = component.dataset.id
    }

    // Find grid parent
    const domComponent = getDOMNode(id)
    const gridId = getGridParentID(domComponent)
    if (!gridId) {
      return
    }

    // Update state
    dragInfo = {
      domTarget: e.target,
      id,
      gridId,
      mode,
      side,
    }

    // Add event handler to clear all drag state when dragging ends
    dragInfo.domTarget.addEventListener("dragend", stopDragging)
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo || dragInfo.grid) {
      return
    }

    const { id, gridId } = dragInfo
    const domComponent = getDOMNode(id)
    const domGrid = getDOMNode(gridId)
    const gridCols = parseInt(domGrid.dataset.cols)
    const gridRows = parseInt(domGrid.dataset.rows)
    const styles = getComputedStyle(domComponent.parentNode)
    if (domGrid) {
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,

        // Ensure things are within limits
        rowStart: minMax(styles["grid-row-start"], 1, gridRows),
        rowEnd: minMax(styles["grid-row-end"], 2, gridRows + 1),
        colStart: minMax(styles["grid-column-start"], 1, gridCols),
        colEnd: minMax(styles["grid-column-end"], 2, gridCols + 1),
      }
      handleEvent(e)
    }
  }

  const onDragOver = e => {
    if (!dragInfo?.grid) {
      return
    }
    handleEvent(e)
  }

  // Callback when drag stops (whether dropped or not)
  const stopDragging = async () => {
    // Save changes
    if ($gridStyles) {
      await builderStore.actions.updateStyles($gridStyles, dragInfo.id)
    }

    // Reset listener
    if (dragInfo?.domTarget) {
      dragInfo.domTarget.removeEventListener("dragend", stopDragging)
    }

    // Reset state
    dragInfo = null
    gridStyles.set(null)
  }

  onMount(() => {
    document.addEventListener("dragstart", onDragStart, false)
    document.addEventListener("dragenter", onDragEnter, false)
    document.addEventListener("dragover", onDragOver, false)
  })

  onDestroy(() => {
    document.removeEventListener("dragstart", onDragStart, false)
    document.removeEventListener("dragenter", onDragEnter, false)
    document.removeEventListener("dragover", onDragOver, false)
  })
</script>
