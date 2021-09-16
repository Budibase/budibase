<script>
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import IndicatorSet from "./IndicatorSet.svelte"
  import DNDPositionIndicator from "./DNDPositionIndicator.svelte"
  import { builderStore } from "stores"

  let dragTarget
  let dropTarget
  let dropMode
  let dropInfo

  const getDOMNodeForComponent = component => {
    const parent = component.closest("[data-type='component']")
    const children = Array.from(parent.childNodes)
    return children?.find(node => node?.nodeType === 1)
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    // Update state
    dragTarget = e.target.dataset.componentId
    builderStore.actions.selectComponent(dragTarget)

    // Highlight being dragged by setting opacity
    const child = getDOMNodeForComponent(e.target)
    if (child) {
      child.style.opacity = "0.5"
    }
  }

  // Callback when drag stops (whether dropped or not)
  const onDragEnd = e => {
    // Reset state and styles
    dropTarget = null
    dropInfo = null

    // Reset opacity style
    const child = getDOMNodeForComponent(e.target)
    if (child) {
      child.style.opacity = ""
    }

    // Re-enable the hover indicator
    builderStore.actions.showHoverIndicator(true)
  }

  // Callback when on top of a component
  const onDragOver = e => {
    e.preventDefault()

    if (dropInfo) {
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
        dropMode = nearestEdge
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
          dropMode = "inside"
        } else {
          dropMode = nearestEdge
        }
      }
    }
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    const element = e.target.closest("[data-type='component']")
    if (
      element &&
      element.dataset.droppable &&
      element.dataset.id !== dragTarget
    ) {
      // Disable hover selection again to ensure it's always disabled.
      // There's a bit of a race condition between the app reinitialisation
      // after selecting the DND component and setting this the first time
      if (get(builderStore).showHoverIndicator) {
        builderStore.actions.showHoverIndicator(false)
      }

      // Store target ID
      dropTarget = element.dataset.id

      // Precompute and store some info to avoid recalculating everything in
      // dragOver
      const child = getDOMNodeForComponent(e.target)
      const bounds = child.getBoundingClientRect()
      dropInfo = {
        name: element.dataset.name,
        droppableInside: element.dataset.droppableInside === "true",
        bounds,
      }
    } else {
      dropInfo = null
      dropTarget = null
    }
  }

  // Callback when leaving a potential drop target.
  // Since we don't style our targets, we don't need to unset anything.
  const onDragLeave = () => {}

  // Callback when dropping a drag on top of some component
  const onDrop = e => {
    e.preventDefault()
    if (dropTarget && dropMode) {
      builderStore.actions.moveComponent(dragTarget, dropTarget, dropMode)
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
  componentId={dropMode === "inside" ? dropTarget : null}
  color="var(--spectrum-global-color-static-green-500)"
  zIndex="930"
  transition
  prefix="Inside"
/>

<DNDPositionIndicator
  componentId={dropTarget}
  {dropInfo}
  mode={dropMode}
  color="var(--spectrum-global-color-static-green-500)"
  zIndex="940"
  transition
/>
