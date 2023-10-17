<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils } from "@budibase/frontend-core"

  let dragInfo
  let gridStyles
  let id

  // Some memoisation of primitive types for performance
  $: jsonStyles = JSON.stringify(gridStyles)
  $: id = dragInfo?.id || id

  // Set ephemeral grid styles on the dragged component
  $: instance = componentStore.actions.getComponentInstance(id)
  $: $instance?.setEphemeralStyles({
    ...gridStyles,
    ...(gridStyles ? { "z-index": 999 } : null),
  })

  // Util to check if a DND event originates from a grid (or inside a grid).
  // This is important as we do not handle grid DND in this handler.
  const isGridEvent = e => {
    return (
      e.target
        .closest?.(".component")
        ?.parentNode.closest(".component")
        ?.childNodes[0].classList.contains("grid") ||
      e.target.classList.contains("anchor")
    )
  }

  // Util to get the inner DOM node by a component ID
  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component.children][0]
  }

  const processEvent = Utils.throttle((mouseX, mouseY) => {
    if (!dragInfo?.grid) {
      return
    }

    const { mode, side, gridId, grid } = dragInfo
    const {
      startX,
      startY,
      rowStart,
      rowEnd,
      colStart,
      colEnd,
      rowDeltaMin,
      rowDeltaMax,
      colDeltaMin,
      colDeltaMax,
    } = grid

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
      deltaY = Math.min(Math.max(deltaY, rowDeltaMin), rowDeltaMax)
      deltaX = Math.min(Math.max(deltaX, colDeltaMin), colDeltaMax)
      const newStyles = {
        "grid-row-start": rowStart + deltaY,
        "grid-row-end": rowEnd + deltaY,
        "grid-column-start": colStart + deltaX,
        "grid-column-end": colEnd + deltaX,
      }
      if (JSON.stringify(newStyles) !== jsonStyles) {
        gridStyles = newStyles
      }
    } else if (mode === "resize") {
      let newStyles = {}
      if (side === "right") {
        newStyles["grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
      } else if (side === "left") {
        newStyles["grid-column-start"] = Math.min(colStart + deltaX, colEnd - 1)
      } else if (side === "top") {
        newStyles["grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "bottom") {
        newStyles["grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-right") {
        newStyles["grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles["grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-left") {
        newStyles["grid-column-start"] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles["grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "top-right") {
        newStyles["grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles["grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "top-left") {
        newStyles["grid-column-start"] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles["grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
      }
      if (JSON.stringify(newStyles) !== jsonStyles) {
        gridStyles = newStyles
      }
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
    const gridId = domComponent?.closest(".grid")?.parentNode.dataset.id
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
    const domNode = getDOMNode(dragInfo.id)
    const styles = window.getComputedStyle(domNode)
    if (domGrid) {
      const minMax = (value, min, max) => Math.min(max, Math.max(min, value))
      const getStyle = x => parseInt(styles?.[x] || "0")
      const getColStyle = x => minMax(getStyle(x), 1, gridCols + 1)
      const getRowStyle = x => minMax(getStyle(x), 1, gridRows + 1)
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,
        rowStart: getRowStyle("grid-row-start"),
        rowEnd: getRowStyle("grid-row-end"),
        colStart: getColStyle("grid-column-start"),
        colEnd: getColStyle("grid-column-end"),
        rowDeltaMin: 1 - getRowStyle("grid-row-start"),
        rowDeltaMax: gridRows + 1 - getRowStyle("grid-row-end"),
        colDeltaMin: 1 - getColStyle("grid-column-start"),
        colDeltaMax: gridCols + 1 - getColStyle("grid-column-end"),
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
    if (gridStyles) {
      await builderStore.actions.updateStyles(gridStyles, dragInfo.id)
    }

    // Reset listener
    if (dragInfo?.domTarget) {
      dragInfo.domTarget.removeEventListener("dragend", stopDragging)
    }

    // Reset state
    dragInfo = null
    gridStyles = null
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
