<script>
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import IndicatorSet from "./IndicatorSet.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { builderStore } from "stores"

  let dragInfo
  let dropInfo

  const getDOMNodeForComponent = component => {
    const parent = component.closest("[data-type='component']")
    const children = Array.from(parent.childNodes)
    return children?.find(node => node?.nodeType === 1)
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    const parent = e.target.closest("[data-type='component']")
    const child = getDOMNodeForComponent(e.target)
    if (!parent?.dataset?.id || !child) {
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
    child.style.opacity = "0.5"
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
    const { top, height } = bounds
    const mouseY = e.clientY
    const elTop = top
    const elBottom = top + height

    // Determine which edge we're nearest as this is needed for potentially
    // any drop mode
    let nearestEdge
    if (Math.abs(elTop - mouseY) < Math.abs(elBottom - mouseY)) {
      nearestEdge = "above"
    } else {
      nearestEdge = "below"
    }

    // If not available to drop inside, just check whether we are closer
    // to the top or bottom
    if (!droppableInside) {
      dropInfo.mode = nearestEdge
    }

    // Otherwise determine whether the user wants to drop inside or at
    // either edge
    else {
      const edgeLimit = Math.min(40, height * 0.33)
      const insideLimit = [
        Math.round(top + edgeLimit),
        Math.round(top + height - edgeLimit),
      ]
      if (mouseY >= insideLimit[0] && mouseY <= insideLimit[1]) {
        dropInfo.mode = "inside"
      } else {
        dropInfo.mode = nearestEdge
      }
    }
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo) {
      return
    }

    const element = e.target.closest("[data-type='component']")
    if (
      element &&
      element.dataset.droppable === "true" &&
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
        droppableInside: element.dataset.droppableInside === "true",
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
    if (dropInfo) {
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

    return () => {
      // Events fired on the draggable target
      document.removeEventListener("dragstart", onDragStart, false)
      document.removeEventListener("dragend", onDragEnd, false)

      // Events fired on the drop targets
      document.removeEventListener("dragover", onDragOver, false)
      document.removeEventListener("dragenter", onDragEnter, false)
      document.removeEventListener("dragleave", onDragLeave, false)
      document.removeEventListener("drop", onDrop, false)
    }
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
