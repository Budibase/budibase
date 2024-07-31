<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"
  import {
    isGridEvent,
    getGridParentID,
    getGridVar,
    getDefaultGridVarValue,
    getOtherDeviceGridVar,
  } from "utils/grid"

  // Grid CSS variables
  $: vars = {
    colStart: $getGridVar("col-start"),
    colEnd: $getGridVar("col-end"),
    rowStart: $getGridVar("row-start"),
    rowEnd: $getGridVar("row-end"),
  }

  let dragInfo
  let gridStyles = memo()
  let id

  // Some memoisation of primitive types for performance
  $: id = dragInfo?.id || id

  // Set ephemeral grid styles on the dragged component
  $: instance = componentStore.actions.getComponentInstance(id)
  $: $instance?.setEphemeralStyles({
    ...$gridStyles,
    ...($gridStyles ? { "z-index": 999 } : null),
  })

  // Sugar for a combination of both min and max
  const minMax = (value, min, max) => Math.min(max, Math.max(min, value))

  // Util to get the inner DOM node by a component ID
  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component?.children][0]
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
    e.dataTransfer.setDragImage(new Image(), 0, 0)

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

    const domGrid = getDOMNode(dragInfo.gridId)
    const gridCols = parseInt(domGrid.dataset.cols)
    const gridRows = parseInt(domGrid.dataset.rows)
    const domNode = getDOMNode(dragInfo.id)?.parentNode
    const styles = window.getComputedStyle(domNode)
    if (domGrid) {
      // Util to get the current grid CSS variable for this device. If unset,
      // fall back to using the other device type.
      const getCurrent = cssVar => {
        let style = styles?.getPropertyValue(cssVar)
        if (!style) {
          style = styles?.getPropertyValue(getOtherDeviceGridVar(cssVar))
        }
        return parseInt(style || getDefaultGridVarValue(cssVar))
      }
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,

        // Ensure things are within limits
        rowStart: minMax(getCurrent(vars.rowStart), 1, gridRows),
        rowEnd: minMax(getCurrent(vars.rowEnd), 2, gridRows + 1),
        colStart: minMax(getCurrent(vars.colStart), 1, gridCols),
        colEnd: minMax(getCurrent(vars.colEnd), 2, gridCols + 1),
      }
      console.log(dragInfo.grid)
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
