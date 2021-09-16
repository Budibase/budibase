<script>
  import { onMount } from "svelte"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { builderStore } from "stores"

  let dragTarget
  let dropTarget

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    dragTarget = e.target.dataset.componentId
    e.target.style.opacity = 0.5
  }

  // Callback when drag stops (whether dropped or not)
  const onDragEnd = e => {
    // reset the transparency
    dragTarget = null
    e.target.style.opacity = ""
    dropTarget = null
  }

  // Callback when on top of a component
  const onDragOver = e => {
    e.preventDefault()
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    const element = e.target.closest("[data-type='component']")
    if (element && element.dataset.droppable === "true") {
      dropTarget = element.dataset.id
    } else {
      dropTarget = null
    }
  }

  // Callback when leaving a potential drop target.
  // Since we don't style our targets, we don't need to unset anything.
  const onDragLeave = () => {}

  // Callback when dropping a drag on top of some component
  const onDrop = e => {
    e.preventDefault()

    // Check if the target is droppable
    const element = e.target.closest("[data-type='component']")
    if (element && element.dataset.droppable === "true") {
      builderStore.actions.moveComponent(dragTarget, dropTarget, "inside")
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
  componentId={dropTarget}
  color="var(--spectrum-global-color-static-red-600)"
  zIndex="930"
  transition
/>
