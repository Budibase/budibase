<script context="module">
  export const Sides = {
    Top: "Top",
    Right: "Right",
    Bottom: "Bottom",
    Left: "Left",
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte"
  import { get } from "svelte/store"
  import IndicatorSet from "./IndicatorSet.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { builderStore } from "stores"

  let dragInfo
  let dropInfo

  const getEdges = (bounds, mousePoint) => {
    const { width, height, top, left } = bounds
    return {
      [Sides.Top]: [mousePoint[0], top],
      [Sides.Right]: [left + width, mousePoint[1]],
      [Sides.Bottom]: [mousePoint[0], top + height],
      [Sides.Left]: [left, mousePoint[1]],
    }
  }

  const calculatePointDelta = (point1, point2) => {
    const deltaX = Math.abs(point1[0] - point2[0])
    const deltaY = Math.abs(point1[1] - point2[1])
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  const getDOMNodeForComponent = component => {
    const parent = component.closest(".component")
    const children = Array.from(parent.children)
    return children[0]
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    const parent = e.target.closest(".component")
    if (!parent?.classList.contains("draggable")) {
      return
    }

    // Update state
    dragInfo = {
      target: parent.dataset.id,
      parent: parent.dataset.parent,
    }
    builderStore.actions.selectComponent(dragInfo.target)
    builderStore.actions.setDragging(true)

    // Highlight being dragged by setting opacity
    const child = getDOMNodeForComponent(e.target)
    if (child) {
      child.style.opacity = "0.5"
    }
  }

  // Callback when drag stops (whether dropped or not)
  const onDragEnd = e => {
    // Reset opacity style
    if (dragInfo) {
      const child = getDOMNodeForComponent(e.target)
      if (child) {
        child.style.opacity = ""
      }
    }

    // Reset state and styles
    dragInfo = null
    dropInfo = null
    builderStore.actions.setDragging(false)
  }

  // Callback when on top of a component
  const onDragOver = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo || !dropInfo) {
      return
    }

    e.preventDefault()
    const { droppableInside, bounds } = dropInfo
    const { top, left, height, width } = bounds
    const mouseY = e.clientY
    const mouseX = e.clientX
    const snapFactor = droppableInside ? 0.33 : 0.5
    const snapLimitV = Math.min(40, height * snapFactor)
    const snapLimitH = Math.min(40, width * snapFactor)

    // Determine all sies we are within snap range of
    let sides = []
    if (mouseY <= top + snapLimitV) {
      sides.push(Sides.Top)
    } else if (mouseY >= top + height - snapLimitV) {
      sides.push(Sides.Bottom)
    }
    if (mouseX < left + snapLimitH) {
      sides.push(Sides.Left)
    } else if (mouseX > left + width - snapLimitH) {
      sides.push(Sides.Right)
    }

    // When no edges match, drop inside if possible
    if (!sides.length) {
      dropInfo.mode = droppableInside ? "inside" : null
      dropInfo.side = null
      return
    }

    // When one edge matches, use that edge
    if (sides.length === 1) {
      dropInfo.side = sides[0]
      if ([Sides.Top, Sides.Left].includes(sides[0])) {
        dropInfo.mode = "above"
      } else {
        dropInfo.mode = "below"
      }
      return
    }

    // When 2 edges match, work out which is closer
    const mousePoint = [mouseX, mouseY]
    const edges = getEdges(bounds, mousePoint)
    const edge1 = edges[sides[0]]
    const delta1 = calculatePointDelta(mousePoint, edge1)
    const edge2 = edges[sides[1]]
    const delta2 = calculatePointDelta(mousePoint, edge2)
    const edge = delta1 < delta2 ? sides[0] : sides[1]
    dropInfo.side = edge
    if ([Sides.Top, Sides.Left].includes(edge)) {
      dropInfo.mode = "above"
    } else {
      dropInfo.mode = "below"
    }
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo || !e.target.closest) {
      return
    }

    const element = e.target.closest(".component:not(.block)")
    if (
      element &&
      element.classList.contains("droppable") &&
      element.dataset.id !== dragInfo.target
    ) {
      // Do nothing if this is the same target
      if (element.dataset.id === dropInfo?.target) {
        return
      }

      // Ensure the dragging flag is always set.
      // There's a bit of a race condition between the app reinitialisation
      // after selecting the DND component and setting this the first time
      if (!get(builderStore).isDragging) {
        builderStore.actions.setDragging(true)
      }

      // Store target ID
      const target = element.dataset.id

      // Precompute and store some info to avoid recalculating everything in
      // dragOver
      const child = getDOMNodeForComponent(e.target)
      const bounds = child.getBoundingClientRect()
      dropInfo = {
        target,
        name: element.dataset.name,
        icon: element.dataset.icon,
        droppableInside: element.classList.contains("empty"),
        bounds,
      }
    } else {
      dropInfo = null
    }
  }

  // Callback when leaving a potential drop target.
  // Since we don't style our targets, we don't need to unset anything.
  const onDragLeave = () => {}

  // Callback when dropping a drag on top of some component
  const onDrop = e => {
    e.preventDefault()
    if (dropInfo?.mode) {
      builderStore.actions.moveComponent(
        dragInfo.target,
        dropInfo.target,
        dropInfo.mode
      )
    }
  }

  onMount(() => {
    // Events fired on the draggable target
    document.addEventListener("dragstart", onDragStart, false)
    document.addEventListener("dragend", onDragEnd, false)

    // Events fired on the drop targets
    document.addEventListener("dragover", onDragOver, false)
    document.addEventListener("dragenter", onDragEnter, false)
    document.addEventListener("dragleave", onDragLeave, false)
    document.addEventListener("drop", onDrop, false)
  })

  onDestroy(() => {
    // Events fired on the draggable target
    document.removeEventListener("dragstart", onDragStart, false)
    document.removeEventListener("dragend", onDragEnd, false)

    // Events fired on the drop targets
    document.removeEventListener("dragover", onDragOver, false)
    document.removeEventListener("dragenter", onDragEnter, false)
    document.removeEventListener("dragleave", onDragLeave, false)
    document.removeEventListener("drop", onDrop, false)
  })
</script>

<IndicatorSet
  componentId={dropInfo?.mode === "inside" ? dropInfo.target : null}
  color="var(--spectrum-global-color-static-green-500)"
  zIndex="930"
  transition
  prefix="Inside"
/>

<DNDPositionIndicator
  {dropInfo}
  color="var(--spectrum-global-color-static-green-500)"
  zIndex="940"
  transition
/>
