<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"

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

  // Util to check if a DND event originates from a grid (or inside a grid).
  // This is important as we do not handle grid DND in this handler.
  const isGridEvent = e => {
    return (
      e.target
        .closest?.(".component")
        ?.parentNode.closest(".component")
        ?.childNodes[0].classList?.contains("grid") ||
      e.target.classList.contains("anchor")
    )
  }

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
      const newStyles = {
        "--grid-row-start": minMax(rowStart + deltaY, 1, rows),
        "--grid-row-end": minMax(rowEnd + deltaY, 2, rows + 1),
        "--grid-column-start": minMax(colStart + deltaX, 1, cols),
        "--grid-column-end": minMax(colEnd + deltaX, 2, cols + 1),
      }
      gridStyles.set(newStyles)
    } else if (mode === "resize") {
      let newStyles = {}
      if (side === "right") {
        newStyles["--grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
      } else if (side === "left") {
        newStyles["--grid-column-start"] = Math.min(
          colStart + deltaX,
          colEnd - 1
        )
      } else if (side === "top") {
        newStyles["--grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "bottom") {
        newStyles["--grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-right") {
        newStyles["--grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles["--grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-left") {
        newStyles["--grid-column-start"] = Math.min(
          colStart + deltaX,
          colEnd - 1
        )
        newStyles["--grid-row-end"] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "top-right") {
        newStyles["--grid-column-end"] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles["--grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "top-left") {
        newStyles["--grid-column-start"] = Math.min(
          colStart + deltaX,
          colEnd - 1
        )
        newStyles["--grid-row-start"] = Math.min(rowStart + deltaY, rowEnd - 1)
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
      const getStyle = x => parseInt(styles?.getPropertyValue(x) || "0")
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,
        rowStart: minMax(getStyle("--grid-row-start"), 1, gridRows),
        rowEnd: minMax(getStyle("--grid-row-end"), 2, gridRows + 1),
        colStart: minMax(getStyle("--grid-column-start"), 1, gridCols),
        colEnd: minMax(getStyle("--grid-column-end"), 2, gridCols + 1),
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
