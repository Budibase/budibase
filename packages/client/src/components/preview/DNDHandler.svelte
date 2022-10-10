<script>
  import { onMount, onDestroy } from "svelte"
  import { get } from "svelte/store"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { builderStore, componentStore } from "stores"
  import PlaceholderOverlay from "./PlaceholderOverlay.svelte"
  import { Utils } from "@budibase/frontend-core"
  import { findComponentById } from "utils/components.js"

  let sourceId
  let targetInfo
  let dropInfo

  // These reactive statements are just a trick to only update the store when
  // the value of one of the properties actually changes
  $: parent = dropInfo?.parent
  $: index = dropInfo?.index
  $: builderStore.actions.updateDNDPlaceholder(parent, index)

  // Util to get the inner DOM node by a component ID
  const getDOMNode = id => {
    const component = document.getElementsByClassName(id)[0]
    return [...component.children][0]
  }

  // Util to calculate the variance of a set of data
  const variance = arr => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length
    let squareSum = 0
    arr.forEach(value => {
      const delta = value - mean
      squareSum += delta * delta
    })
    return squareSum / arr.length
  }

  // Callback when drag stops (whether dropped or not)
  const stopDragging = () => {
    // Reset state
    sourceId = null
    targetInfo = null
    dropInfo = null
    builderStore.actions.setDragging(false)

    // Reset listener
    if (sourceId) {
      const component = document.getElementsByClassName(sourceId)[0]
      if (component) {
        component.removeEventListener("dragend", stopDragging)
      }
    }
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = e => {
    const component = e.target.closest(".component")
    if (!component?.classList.contains("draggable")) {
      return
    }

    // Hide drag ghost image
    e.dataTransfer.setDragImage(new Image(), 0, 0)

    // Add event handler to clear all drag state when dragging ends
    component.addEventListener("dragend", stopDragging)

    // Update state
    sourceId = component.dataset.id
    builderStore.actions.selectComponent(sourceId)
    builderStore.actions.setDragging(true)

    // Execute this asynchronously so we don't kill the drag event by hiding
    // the component in the same handler as starting the drag event
    setTimeout(() => {
      onDragEnter(e)
    }, 0)
  }

  // Core logic for handling drop events and determining where to render the
  // drop target placeholder
  const processEvent = (mouseX, mouseY) => {
    if (!targetInfo) {
      return null
    }
    let { id, parent, node, acceptsChildren, empty } = targetInfo

    // If we're over something that does not accept children then we go up a
    // level and consider the mouse position relative to the parent
    if (!acceptsChildren) {
      id = parent
      empty = false
      node = getDOMNode(parent)
    }

    // We're now hovering over something which does accept children.
    // If it is empty, just go inside it.
    if (empty) {
      dropInfo = {
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
    const column = ["centerX", "left", "right"].includes(variances[0].side)

    // Calculate breakpoints between child components so we can determine the
    // index to drop the component in.
    // We want to ignore the placeholder from this calculation as it should not
    // be considered a real child of the parent.
    let breakpoints = childCoords
      .filter(x => !x.placeholder)
      .map(x => {
        return column ? x.centerY : x.centerX
      })

    // Determine the index to drop the component in
    const mousePosition = column ? mouseY : mouseX
    let idx = 0
    while (idx < breakpoints.length && breakpoints[idx] < mousePosition) {
      idx++
    }
    dropInfo = {
      parent: id,
      index: idx,
    }
  }
  const throttledProcessEvent = Utils.throttle(processEvent, 130)

  const handleEvent = e => {
    e.preventDefault()
    throttledProcessEvent(e.clientX, e.clientY)
  }

  // Callback when on top of a component
  const onDragOver = e => {
    if (!sourceId || !targetInfo) {
      return
    }
    handleEvent(e)
  }

  // Callback when entering a potential drop target
  const onDragEnter = e => {
    if (!sourceId) {
      return
    }

    // Find the next valid component to consider dropping over, ignoring nested
    // block components
    const component = e.target?.closest?.(".component:not(.block)")
    if (component && component.classList.contains("droppable")) {
      targetInfo = {
        id: component.dataset.id,
        parent: component.dataset.parent,
        node: getDOMNode(component.dataset.id),
        empty: component.classList.contains("empty"),
        acceptsChildren: component.classList.contains("parent"),
      }
      handleEvent(e)
    }
  }

  // Callback when dropping a drag on top of some component
  const onDrop = () => {
    let target, mode

    // Convert parent + index into target + mode
    if (sourceId && dropInfo?.parent && dropInfo.index != null) {
      const parent = findComponentById(
        get(componentStore).currentAsset?.props,
        dropInfo.parent
      )
      if (!parent) {
        return
      }

      // Filter out source component and placeholder from consideration
      const children = parent._children?.filter(
        x => x._id !== "placeholder" && x._id !== sourceId
      )

      // Use inside if no existing children
      if (!children?.length) {
        target = parent._id
        mode = "inside"
      } else if (dropInfo.index === 0) {
        target = children[0]?._id
        mode = "above"
      } else {
        target = children[dropInfo.index - 1]?._id
        mode = "below"
      }
    }

    if (target && mode) {
      builderStore.actions.moveComponent(sourceId, target, mode)
    }
  }

  onMount(() => {
    // Events fired on the draggable target
    document.addEventListener("dragstart", onDragStart, false)

    // Events fired on the drop targets
    document.addEventListener("dragover", onDragOver, false)
    document.addEventListener("dragenter", onDragEnter, false)
    document.addEventListener("drop", onDrop, false)
  })

  onDestroy(() => {
    // Events fired on the draggable target
    document.removeEventListener("dragstart", onDragStart, false)

    // Events fired on the drop targets
    document.removeEventListener("dragover", onDragOver, false)
    document.removeEventListener("dragenter", onDragEnter, false)
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
