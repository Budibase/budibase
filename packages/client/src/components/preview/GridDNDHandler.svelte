<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, screenStore } from "stores"
  import { Utils } from "@budibase/frontend-core"
  import { findComponentById } from "utils/components.js"

  let dragInfo
  let gridStyles

  $: dragNode = getDOMNode(dragInfo?.id)
  $: applyStyles(dragNode, gridStyles)

  const insideGrid = e => {
    return e.target?.closest?.(".grid") || e.target.classList.contains("anchor")
  }

  // Util to get the inner DOM node by a component ID
  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component.children][0]
  }

  const applyStyles = (dragNode, gridStyles) => {
    if (!dragNode || !gridStyles) {
      return
    }
    Object.entries(gridStyles).forEach(([style, value]) => {
      dragNode.style[style] = value
    })
  }

  // Callback when drag stops (whether dropped or not)
  const stopDragging = () => {
    // Save changes
    if (gridStyles) {
      builderStore.actions.updateStyles(gridStyles, dragInfo.id)
    }

    // Reset listener
    if (dragInfo?.domTarget) {
      dragInfo.domTarget.removeEventListener("dragend", stopDragging)
    }

    // Reset state
    dragInfo = null
    gridStyles = null
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    if (!insideGrid(e)) {
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
    if (!dragInfo || dragInfo.grid || !insideGrid(e)) {
      return
    }

    const compDef = findComponentById(
      $screenStore.activeScreen.props,
      dragInfo.id
    )
    if (!compDef) {
      return
    }
    const domGrid = getDOMNode(dragInfo.gridId)
    if (domGrid) {
      const getStyle = x => parseInt(compDef._styles.normal?.[x] || "0")
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,
        rowStart: getStyle("grid-row-start"),
        rowEnd: getStyle("grid-row-end"),
        colStart: getStyle("grid-column-start"),
        colEnd: getStyle("grid-column-end"),
        rowDeltaMin: 1 - getStyle("grid-row-start"),
        rowDeltaMax:
          parseInt(domGrid.dataset.cols) + 1 - getStyle("grid-row-end"),
        colDeltaMin: 1 - getStyle("grid-column-start"),
        colDeltaMax:
          parseInt(domGrid.dataset.cols) + 1 - getStyle("grid-column-end"),
      }
      handleEvent(e)
    }
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
    const { width, height } = domGrid.getBoundingClientRect()

    const colWidth = width / cols
    const diffX = mouseX - startX
    let deltaX = Math.round(diffX / colWidth)
    const rowHeight = height / cols
    const diffY = mouseY - startY
    let deltaY = Math.round(diffY / rowHeight)

    if (mode === "move") {
      deltaY = Math.min(Math.max(deltaY, rowDeltaMin), rowDeltaMax)
      deltaX = Math.min(Math.max(deltaX, colDeltaMin), colDeltaMax)
      gridStyles = {
        "grid-row-start": rowStart + deltaY,
        "grid-row-end": rowEnd + deltaY,
        "grid-column-start": colStart + deltaX,
        "grid-column-end": colEnd + deltaX,
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
      gridStyles = newStyles
    }
  }, 100)

  const handleEvent = e => {
    e.preventDefault()
    e.stopPropagation()
    processEvent(e.clientX, e.clientY)
  }

  const onDragOver = e => {
    if (!dragInfo?.grid || !insideGrid(e)) {
      return
    }
    handleEvent(e)
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
