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
  import IndicatorSet from "./IndicatorSet.svelte"
  import { builderStore } from "stores"
  import PlaceholderOverlay from "./PlaceholderOverlay.svelte"

  let dragInfo
  let dropInfo
  let placeholderInfo

  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component.children][0]
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    const component = e.target.closest(".component")
    if (!component?.classList.contains("draggable")) {
      return
    }

    // Update state
    dragInfo = {
      target: component.dataset.id,
    }
    builderStore.actions.selectComponent(dragInfo.target)
    builderStore.actions.setDragging(true)

    // Highlight being dragged by setting opacity
    const child = getDOMNode(component.dataset.id)
    if (child) {
      child.style.opacity = "0.5"
    }
  }

  // Callback when drag stops (whether dropped or not)
  const onDragEnd = () => {
    // Reset opacity style
    if (dragInfo) {
      const child = getDOMNode(dragInfo.target)
      if (child) {
        child.style.opacity = ""
      }
    }

    // Reset state and styles
    dragInfo = null
    dropInfo = null
    builderStore.actions.setDragging(false)
  }

  const variance = arr => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length
    let squareSum = 0
    arr.forEach(value => {
      const delta = value - mean
      squareSum += delta * delta
    })
    return squareSum / arr.length
  }

  const handleEvent = e => {
    if (!dropInfo) {
      return null
    }
    e.preventDefault()

    let { id, parent, node, acceptsChildren, empty } = dropInfo
    const mouseY = e.clientY
    const mouseX = e.clientX

    // If we're over something that does not accept children then we go up a
    // level and consider the mouse position relative to the parent
    if (!acceptsChildren) {
      id = parent
      empty = false
      node = getDOMNode(parent)
    }

    // We're now hovering over something which does accept children.
    // If it is empty, just go inside it
    if (empty) {
      placeholderInfo = {
        parent: id,
        index: 0,
      }
      return
    }

    // We're now hovering over something which accepts children and is not
    // empty, so we need to work out where to inside the placeholder
    // Calculate the coordinates of various locations on each child.
    // We include the placeholder component in this as it guarantees we have
    // at least 2 child components, and therefore guarantee there is no
    // ambiguity in the layout.
    const childCoords = [...(node.children || [])].map(node => {
      const bounds = node.children[0].getBoundingClientRect()
      return {
        placeholder: node.classList.contains("placeholder"),
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2,
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
      }
    })

    // Calculate the variance between each set of positions on the children
    const variances = Object.keys(childCoords[0])
      .filter(x => x !== "placeholder")
      .map(key => {
        const coords = childCoords.map(x => x[key])
        return {
          variance: variance(coords),
          side: key,
        }
      })

    // Sort by variance. The lowest variance position indicates whether we are
    // in a row or column layout
    variances.sort((a, b) => {
      return a.variance < b.variance ? -1 : 1
    })
    console.log(variances[0].side)
    const column = ["centerX", "left", "right"].includes(variances[0].side)
    console.log(column ? "COL" : "ROW")

    // Find the correct index to drop in based on the midpoints of each child
    // in their primary axis.
    // Here we filter out the placeholder component as we do not want it to
    // affect the determination of the new index.
    const childPositions = column
      ? childCoords.filter(x => !x.placeholder).map(x => x.centerY)
      : childCoords.filter(x => !x.placeholder).map(x => x.centerX)
    const mousePosition = column ? mouseY : mouseX
    let idx = 0
    while (idx < childPositions.length && childPositions[idx] < mousePosition) {
      idx++
    }
    placeholderInfo = {
      parent: id,
      index: idx,
    }
  }

  // Callback when on top of a component
  const onDragOver = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo || !dropInfo) {
      return
    }
    handleEvent(e)
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    // Skip if we aren't validly dragging currently
    if (!dragInfo || !e.target.closest) {
      return
    }

    const component = e.target.closest(".component:not(.block)")
    if (
      component &&
      component.classList.contains("droppable") &&
      component.dataset.id !== dragInfo.target
    ) {
      // Do nothing if this is the same target
      if (component.dataset.id === dropInfo?.target) {
        return
      }

      // Precompute and store some info to avoid recalculating everything in
      // dragOver
      dropInfo = {
        id: component.dataset.id,
        parent: component.dataset.parent,
        node: getDOMNode(component.dataset.id),
        empty: component.classList.contains("empty"),
        acceptsChildren: component.classList.contains("parent"),
      }

      handleEvent(e)
    }
  }

  // Callback when leaving a potential drop target.
  // Since we don't style our targets, we don't need to unset anything.
  const onDragLeave = () => {}

  // Callback when dropping a drag on top of some component
  const onDrop = e => {
    e.preventDefault()
    dropInfo = null
    placeholderInfo = null
    dragInfo = null
    builderStore.actions.setDragging(false)
    if (dropInfo?.mode) {
      // builderStore.actions.moveComponent(
      //   dragInfo.target,
      //   dropInfo.target,
      //   dropInfo.mode
      // )
    }
  }

  $: parent = placeholderInfo?.parent
  $: index = placeholderInfo?.index
  $: builderStore.actions.updateDNDPlaceholder(parent, index)

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
  componentId={$builderStore.dndParent}
  color="var(--spectrum-global-color-static-green-500)"
  zIndex="930"
  transition
  prefix="Inside"
/>

{#if $builderStore.isDragging}
  <PlaceholderOverlay />
{/if}
