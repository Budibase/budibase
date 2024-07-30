<script>
  import { onMount, onDestroy } from "svelte"
  import { builderStore, componentStore } from "stores"
  import { Utils, memo } from "@budibase/frontend-core"

  // Enum for device preview type, included in CSS variables
  const Devices = {
    Desktop: "desktop",
    Mobile: "mobile",
  }

  // Generates the CSS variable for a certain grid param suffix, for the current
  // device
  const getCSSVar = suffix => {
    const device =
      $builderStore.previewDevice === Devices.Mobile
        ? Devices.Mobile
        : Devices.Desktop
    return `--grid-${device}-${suffix}`
  }

  // Generates the CSS variable for a certain grid param suffix, for the other
  // device variant than the one included in this variable
  const getOtherDeviceCSSVar = cssVar => {
    if (cssVar.includes(Devices.Desktop)) {
      return cssVar.replace(Devices.Desktop, Devices.Mobile)
    } else {
      return cssVar.replace(Devices.Mobile, Devices.Desktop)
    }
  }

  // Gets the default value for a certain grid CSS variable
  const getDefaultValue = cssVar => {
    return cssVar.endsWith("-start") ? 1 : 2
  }

  // Enums for our grid CSS variables, for the current device
  const Vars = {
    get ColStart() {
      return getCSSVar("col-start")
    },
    get ColEnd() {
      return getCSSVar("col-end")
    },
    get RowStart() {
      return getCSSVar("row-start")
    },
    get RowEnd() {
      return getCSSVar("row-end")
    },
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
      deltaX = minMax(deltaX, 1 - colStart, cols + 1 - colEnd)
      deltaY = minMax(deltaY, 1 - rowStart, rows + 1 - rowEnd)
      const newStyles = {
        [Vars.ColStart]: colStart + deltaX,
        [Vars.ColEnd]: colEnd + deltaX,
        [Vars.RowStart]: rowStart + deltaY,
        [Vars.RowEnd]: rowEnd + deltaY,
      }
      gridStyles.set(newStyles)
    } else if (mode === "resize") {
      let newStyles = {}
      if (side === "right") {
        newStyles[Vars.ColEnd] = Math.max(colEnd + deltaX, colStart + 1)
      } else if (side === "left") {
        newStyles[Vars.ColStart] = Math.min(colStart + deltaX, colEnd - 1)
      } else if (side === "top") {
        newStyles[Vars.RowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "bottom") {
        newStyles[Vars.RowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-right") {
        newStyles[Vars.ColEnd] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles[Vars.RowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "bottom-left") {
        newStyles[Vars.ColStart] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles[Vars.RowEnd] = Math.max(rowEnd + deltaY, rowStart + 1)
      } else if (side === "top-right") {
        newStyles[Vars.ColEnd] = Math.max(colEnd + deltaX, colStart + 1)
        newStyles[Vars.RowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
      } else if (side === "top-left") {
        newStyles[Vars.ColStart] = Math.min(colStart + deltaX, colEnd - 1)
        newStyles[Vars.RowStart] = Math.min(rowStart + deltaY, rowEnd - 1)
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
      // Util to get the current grid CSS variable for this device. If unset,
      // fall back to using the other device type.
      const getCurrent = cssVar => {
        let style = styles?.getPropertyValue(cssVar)
        if (!style) {
          style = styles?.getPropertyValue(getOtherDeviceCSSVar(cssVar))
        }
        return parseInt(style || getDefaultValue(cssVar))
      }
      dragInfo.grid = {
        startX: e.clientX,
        startY: e.clientY,

        // Ensure things are within limits
        rowStart: minMax(getCurrent(Vars.RowStart), 1, gridRows),
        rowEnd: minMax(getCurrent(Vars.RowEnd), 2, gridRows + 1),
        colStart: minMax(getCurrent(Vars.ColStart), 1, gridCols),
        colEnd: minMax(getCurrent(Vars.ColEnd), 2, gridCols + 1),
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
