<script lang="ts">
  import { onMount, onDestroy, getContext } from "svelte"
  import {
    builderStore,
    componentStore,
    dndIsDragging,
    dndStore,
    dndSource,
    isGridScreen,
  } from "@/stores"
  import { Utils, memo } from "@budibase/frontend-core"
  import { DNDPlaceholderID, GridRowHeight } from "@/constants"
  import {
    isGridEvent,
    GridParams,
    getGridVar,
    Devices,
    GridDragMode,
  } from "@/utils/grid"
  import { DropPosition } from "@budibase/types"

  type GridDragSide =
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"

  interface GridDragInfo {
    mode: GridDragMode
    side?: GridDragSide
    domTarget?: HTMLElement
    domComponent: HTMLElement
    domGrid: HTMLElement
    id: string
    gridId: string
    grid: {
      startX: number
      startY: number
      rowStart: number
      rowEnd: number
      colStart: number
      colEnd: number
    }
  }

  const context = getContext("context")

  // Smallest possible 1x1 transparent GIF
  const ghost = new Image(1, 1)
  ghost.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

  let scrollElement: HTMLElement
  let dragInfo: GridDragInfo | undefined
  let styles = memo<Record<string, number> | undefined>()

  // Grid CSS variables
  $: device = $context.device?.mobile ? Devices.Mobile : Devices.Desktop
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
  $: applyStyles($instance, $styles)

  // Reset when not dragging new components
  $: !$dndIsDragging && stopDragging()

  const scrollOffset = () => scrollElement?.scrollTop || 0

  const applyStyles = async (
    instance: any,
    styles: Record<string, number> | undefined
  ) => {
    instance?.setEphemeralStyles(styles)

    // If dragging a new component on to a grid screen, tick to allow the
    // real component to render in the new position before updating the DND
    // store, preventing the green DND overlay from being out of position
    if ($dndSource?.isNew && styles) {
      dndStore.actions.updateNewComponentProps({
        _styles: {
          normal: styles,
        },
      })
    }
  }

  // Sugar for a combination of both min and max
  const minMax = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

  const processEvent = Utils.domDebounce((mouseX: number, mouseY: number) => {
    if (!dragInfo?.grid) {
      return
    }
    const { mode, grid, domGrid } = dragInfo
    const { startX, startY, rowStart, rowEnd, colStart, colEnd } = grid
    if (!domGrid) {
      return
    }
    const cols = parseInt(domGrid.dataset.cols || "")
    const colSize = parseInt(domGrid.dataset.colSize || "")
    if (isNaN(cols) || isNaN(colSize)) {
      throw "DOM grid missing required dataset attributes"
    }
    const diffX = mouseX - startX
    let deltaX = Math.round(diffX / colSize)
    const diffY = mouseY - startY + scrollOffset()
    let deltaY = Math.round(diffY / GridRowHeight)
    if (mode === GridDragMode.Move) {
      deltaX = minMax(deltaX, 1 - colStart, cols + 1 - colEnd)
      deltaY = Math.max(deltaY, 1 - rowStart)
      const newStyles = {
        [vars.colStart]: colStart + deltaX,
        [vars.colEnd]: colEnd + deltaX,
        [vars.rowStart]: rowStart + deltaY,
        [vars.rowEnd]: rowEnd + deltaY,
      }
      styles.set(newStyles)
    } else if (mode === GridDragMode.Resize) {
      const { side } = dragInfo
      let newStyles: Record<string, number> = {}
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

  const handleEvent = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    processEvent(e.clientX, e.clientY)
  }

  // Callback when dragging a new component over the preview iframe in a valid
  // position for the first time
  const startDraggingPlaceholder = () => {
    const domComponent = document.getElementsByClassName(DNDPlaceholderID)[0]
    const domGrid = domComponent?.closest(".grid")
    if (
      !(domComponent instanceof HTMLElement) ||
      !(domGrid instanceof HTMLElement)
    ) {
      return
    }
    const styles = getComputedStyle(domComponent)
    const bounds = domComponent.getBoundingClientRect()

    // Show as active
    domComponent.classList.add("dragging")
    domGrid.classList.add("highlight")

    // Update state
    dragInfo = {
      domComponent,
      domGrid,
      id: DNDPlaceholderID,
      gridId: domGrid.parentElement!.dataset.id!,
      mode: GridDragMode.Move,
      grid: {
        startX: bounds.left + bounds.width / 2,
        startY: bounds.top + bounds.height / 2 + scrollOffset(),
        rowStart: parseInt(styles.gridRowStart),
        rowEnd: parseInt(styles.gridRowEnd),
        colStart: parseInt(styles.gridColumnStart),
        colEnd: parseInt(styles.gridColumnEnd),
      },
    }
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = (e: DragEvent) => {
    if (!isGridEvent(e)) {
      return
    }

    // Hide drag ghost image
    e.dataTransfer.setDragImage(ghost, 0, 0)

    // Extract state
    let mode: GridDragMode, id: string, side
    if (e.target.dataset.indicator === "true") {
      mode = e.target.dataset.dragMode as GridDragMode
      id = e.target.dataset.id!
      side = e.target.dataset.side as GridDragSide
    } else {
      // Handle move
      mode = GridDragMode.Move
      const component = e.target.closest(".component") as HTMLElement
      id = component.dataset.id!
    }

    // If holding ctrl/cmd then leave behind a duplicate of this component
    if (mode === GridDragMode.Move && (e.ctrlKey || e.metaKey)) {
      builderStore.actions.duplicateComponent(id, DropPosition.ABOVE, false)
    }

    // Find grid parent and read from DOM
    const domComponent = document.getElementsByClassName(id)[0]
    const domGrid = domComponent?.closest(".grid")
    if (
      !(domComponent instanceof HTMLElement) ||
      !(domGrid instanceof HTMLElement)
    ) {
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
      gridId: domGrid.parentElement!.dataset.id!,
      mode,
      side,
      grid: {
        startX: e.clientX,
        startY: e.clientY + scrollOffset(),
        rowStart: parseInt(styles.gridRowStart),
        rowEnd: parseInt(styles.gridRowEnd),
        colStart: parseInt(styles.gridColumnStart),
        colEnd: parseInt(styles.gridColumnEnd),
      },
    }

    // Add event handler to clear all drag state when dragging ends
    dragInfo.domTarget!.addEventListener("dragend", stopDragging, false)
  }

  const onDragOver = (e: DragEvent) => {
    if (!dragInfo) {
      // Check if we're dragging a new component
      if ($dndIsDragging && $dndSource?.isNew && $isGridScreen) {
        startDraggingPlaceholder()
      }
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
    domTarget?.removeEventListener("dragend", stopDragging)

    // Save changes
    if ($styles) {
      builderStore.actions.updateStyles($styles, id)
    }

    // Reset state
    dragInfo = undefined
    styles.set(undefined)
  }

  onMount(() => {
    scrollElement = document.getElementsByClassName(
      "screen-wrapper"
    )[0] as HTMLElement
    document.addEventListener("dragstart", onDragStart, false)
    document.addEventListener("dragover", onDragOver, false)
    document.addEventListener("scroll", processEvent)
  })

  onDestroy(() => {
    document.removeEventListener("dragstart", onDragStart, false)
    document.removeEventListener("dragover", onDragOver, false)
    document.removeEventListener("scroll", processEvent)
  })
</script>
