<script>
  import { onMount, onDestroy, getContext } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"
  import { GridRowHeight } from "constants"
  import {
    isGridEvent,
    GridParams,
    getGridVar,
    Devices,
    GridDragModes,
  } from "utils/grid"

  const context = getContext("context")

  // Smallest possible 1x1 transparent GIF
  const ghost = new Image(1, 1)
  ghost.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

  let dragInfo
  let styles = memo()

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

  // Sugar for a combination of both min and max
  const minMax = (value, min, max) => Math.min(max, Math.max(min, value))

  const processEvent = Utils.domDebounce((mouseX, mouseY) => {
    if (!dragInfo?.grid) {
      return
    }
    const { mode, side, grid, domGrid } = dragInfo
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
    if (mode === GridDragModes.Move) {
      deltaX = minMax(deltaX, 1 - colStart, cols + 1 - colEnd)
      deltaY = Math.max(deltaY, 1 - rowStart)
      const newStyles = {
        [vars.colStart]: colStart + deltaX,
        [vars.colEnd]: colEnd + deltaX,
        [vars.rowStart]: rowStart + deltaY,
        [vars.rowEnd]: rowEnd + deltaY,
      }
      styles.set(newStyles)
    } else if (mode === GridDragModes.Resize) {
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
      styles.set(newStyles)
    }
  })

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
    if (e.target.dataset.indicator === "true") {
      mode = e.target.dataset.dragMode
      id = e.target.dataset.id
      side = e.target.dataset.side
    } else {
      // Handle move
      mode = GridDragModes.Move
      const component = e.target.closest(".component")
      id = component.dataset.id
    }

    // If holding ctrl/cmd then leave behind a duplicate of this component
    if (mode === GridDragModes.Move && (e.ctrlKey || e.metaKey)) {
      builderStore.actions.duplicateComponent(id, "above", false)
    }

    // Find grid parent and read from DOM
    const domComponent = document.getElementsByClassName(id)[0]
    const domGrid = domComponent?.closest(".grid")
    if (!domGrid) {
      return
    }
    const styles = getComputedStyle(domComponent)

    // Show as active
    domComponent.classList.add("dragging")
    domGrid.classList.add("highlight")
    builderStore.actions.selectComponent(id)

    // Update state
    dragInfo = {
      domTarget: e.target,
      domComponent,
      domGrid,
      id,
      gridId: domGrid.parentNode.dataset.id,
      mode,
      side,
      grid: {
        startX: e.clientX,
        startY: e.clientY,
        rowStart: parseInt(styles["grid-row-start"]),
        rowEnd: parseInt(styles["grid-row-end"]),
        colStart: parseInt(styles["grid-column-start"]),
        colEnd: parseInt(styles["grid-column-end"]),
      },
    }

    // Add event handler to clear all drag state when dragging ends
    dragInfo.domTarget.addEventListener("dragend", stopDragging)
  }

  const onDragOver = e => {
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
    const { id, domTarget, domGrid, domComponent } = dragInfo

    // Reset DOM
    domComponent.classList.remove("dragging")
    domGrid.classList.remove("highlight")
    domTarget.removeEventListener("dragend", stopDragging)

    // Save changes
    if ($styles) {
      builderStore.actions.updateStyles($styles, id)
    }

    // Reset state
    dragInfo = null
    styles.set(null)
  }

  onMount(() => {
    document.addEventListener("dragstart", onDragStart, false)
    document.addEventListener("dragover", onDragOver, false)
  })

  onDestroy(() => {
    document.removeEventListener("dragstart", onDragStart, false)
    document.removeEventListener("dragover", onDragOver, false)
  })
</script>
