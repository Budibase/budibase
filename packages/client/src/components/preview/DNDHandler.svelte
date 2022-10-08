<script>
  import { onMount, onDestroy } from "svelte"
  import IndicatorSet from "./IndicatorSet.svelte"
  import { builderStore } from "stores"
  import PlaceholderOverlay from "./PlaceholderOverlay.svelte"
  import { Utils } from "@budibase/frontend-core"

  let dragInfo
  let dropInfo
  let placeholderInfo

  $: parent = placeholderInfo?.parent
  $: index = placeholderInfo?.index
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
    console.log("END")

    // Reset state
    dragInfo = null
    dropInfo = null
    placeholderInfo = null
    builderStore.actions.setDragging(false)

    // Reset listener
    if (dragInfo?.target) {
      const component = document.getElementsByClassName(dragInfo.target)[0]
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
    dragInfo = {
      target: component.dataset.id,
    }
    builderStore.actions.selectComponent(dragInfo.target)
    builderStore.actions.setDragging(true)

    // Execute this asynchronously so we don't kill the drag event by hiding
    // the component in the same handler as starting the drag event
    setTimeout(() => {
      onDragEnter(e)
    }, 0)
  }

  let lastX
  let lastY
  let lastTime

  const processEvent = (mouseX, mouseY) => {
    if (!dropInfo) {
      return null
    }

    let { id, parent, node, acceptsChildren, empty } = dropInfo

    // Debounce by 10px difference
    // if (lastX != null && lastY != null) {
    //   const delta = Math.abs(mouseY - lastY) + Math.abs(mouseX - lastX)
    //   if (delta < 10) {
    //     console.log("delta fail")
    //     return
    //   }
    // }
    // lastX = mouseX
    // lastY = mouseY

    // Debounce by time
    // if (Date.now() - (lastTime || 0) < 100) {
    //   console.log("time fail")
    //   return
    // }
    // lastTime = Date.now()

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
    const variances = Object.keys(childCoords[0]).map(key => {
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
    console.log(column ? "COL" : "ROW")

    /** SYMMETRICAL BREAKPOINTS **/
    // let breakpoints = []
    // for (let i = 0; i < childCoords.length - 1; i++) {
    //   const child1 = childCoords[i]
    //   const child2 = childCoords[i + 1]
    //   let breakpoint
    //   if (column) {
    //     const top = Math.min(child1.top, child2.top)
    //     const bottom = Math.max(child1.bottom, child2.bottom)
    //     breakpoint = (top + bottom) / 2
    //   } else {
    //     const left = Math.min(child1.left, child2.left)
    //     const right = Math.max(child1.right, child2.right)
    //     breakpoint = (left + right) / 2
    //   }
    //   breakpoints.push(breakpoint)
    // }

    /** CENTER BREAKPOINTS **/
    let breakpoints = childCoords
      .filter(x => !x.placeholder)
      .map(x => {
        return column ? x.centerY : x.centerX
      })

    /** NEXT EDGE BREAKPOINTS **/
    // let breakpoints = []
    // for (let i = 0; i < childCoords.length; i++) {
    //   let breakpoint
    //   if (column) {
    //     if (mouseY > childCoords[i].top && mouseY < childCoords[i].bottom) {
    //       // Inside this container
    //       if (childCoords[i + 1]) {
    //         breakpoint = childCoords[i + 1].top
    //       } else {
    //         breakpoint = childCoords[i].top
    //       }
    //     } else {
    //       breakpoint =
    //         mouseY < childCoords[i].bottom
    //           ? childCoords[i].top
    //           : childCoords[i].bottom
    //     }
    //   } else {
    //     breakpoint =
    //       mouseX < childCoords[i].left
    //         ? childCoords[i].left
    //         : childCoords[i].right
    //   }
    //   breakpoints.push(breakpoint)
    // }

    // Determine the index to drop the component in
    const mousePosition = column ? mouseY : mouseX

    let idx = 0
    while (idx < breakpoints.length && breakpoints[idx] < mousePosition) {
      idx++
    }

    // console.log(mousePosition, breakpoints.map(Math.round), idx)

    placeholderInfo = {
      parent: id,
      index: idx,
    }
  }
  const throttledProcessEvent = Utils.throttle(processEvent, 250)

  const handleEvent = e => {
    e.preventDefault()
    throttledProcessEvent(e.clientX, e.clientY)
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
    if (component && component.classList.contains("droppable")) {
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

  // Callback when dropping a drag on top of some component
  const onDrop = () => {
    console.log("DROP")
    // builderStore.actions.moveComponent(
    //   dragInfo.target,
    //   dropInfo.target,
    //   dropInfo.mode
    // )
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
