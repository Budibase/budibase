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
  import { builderStore, componentStore } from "stores"
  import PlaceholderOverlay from "./PlaceholderOverlay.svelte"

  let dragInfo
  let dropInfo
  let placeholderInfo

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

    let { id, parent, node, index, acceptsChildren, empty } = dropInfo
    const mouseY = e.clientY
    const mouseX = e.clientX

    // if (!dropInfo.bounds) {
    // } else {
    //   dropInfo.bounds.top = node.offsetTop
    //   dropInfo.bounds.left = node.offsetLeft
    //   console.log(node.offsetTop)
    // }

    // console.log("calc")
    // dropInfo.bounds = bounds

    // If we're over something that does not accept children then we must go
    // above or below this component
    if (!acceptsChildren) {
      id = parent
      acceptsChildren = true
      empty = false
      node = getDOMNode(parent)
      //
      //
      // const bounds = node.getBoundingClientRect()
      // const { top, left, height, width } = bounds
      // const snapFactor = 0.5
      // const snapLimitV = Math.min(40, height * snapFactor)
      // const snapLimitH = Math.min(40, width * snapFactor)
      //
      // // Determine all sides we are within snap range of
      // let sides = []
      // if (mouseY <= top + snapLimitV) {
      //   sides.push(Sides.Top)
      // } else if (mouseY >= top + height - snapLimitV) {
      //   sides.push(Sides.Bottom)
      // }
      // if (mouseX < left + snapLimitH) {
      //   sides.push(Sides.Left)
      // } else if (mouseX > left + width - snapLimitH) {
      //   sides.push(Sides.Right)
      // }
      //
      // // If we're somehow not in range of any side, do nothing
      // if (!sides.length) {
      //   console.log("no sides match")
      //   return
      // }
      //
      // let side
      // if (sides.length === 1) {
      //   // When one edge matches, use that edge
      //   side = sides[0]
      // } else {
      //   // When 2 edges match, work out which is closer
      //   const mousePoint = [mouseX, mouseY]
      //   const edges = getEdges(bounds, mousePoint)
      //   const edge1 = edges[sides[0]]
      //   const delta1 = calculatePointDelta(mousePoint, edge1)
      //   const edge2 = edges[sides[1]]
      //   const delta2 = calculatePointDelta(mousePoint, edge2)
      //   side = delta1 < delta2 ? sides[0] : sides[1]
      // }
      // if ([Sides.Top, Sides.Left].includes(side)) {
      //   // Before, so use the current index
      //   console.log("before")
      //   placeholderInfo = {
      //     parent: parent,
      //     index: index,
      //   }
      // } else {
      //   console.log("after")
      //   // After, so use the next index
      //   placeholderInfo = {
      //     parent: parent,
      //     index: index + 1,
      //   }
      // }
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

    // Check we're actually inside
    // if (
    //   mouseY < top ||
    //   mouseY > top + height ||
    //   mouseX < left ||
    //   mouseX > left + width
    // ) {
    //   console.log("not inside")
    //   return
    // }

    // Get all DOM nodes of children of this component.
    // Filter out the placeholder as we don't want it to affect the index of
    // the new placeholder.
    const children = [...(node.children || [])]
      .filter(x => !x.classList.contains("placeholder"))
      .map(x => x.children[0])

    // Calculate centers of each child
    const centers = children.map(child => {
      const childBounds = child.getBoundingClientRect()
      return [
        childBounds.left + childBounds.width / 2,
        childBounds.top + childBounds.height / 2,
      ]
    })

    // Calculate variance of X and Y centers to determine layout
    const xCoords = centers.map(x => x[0])
    const yCoords = centers.map(x => x[1])
    const xVariance = variance(xCoords)
    const yVariance = variance(yCoords)
    const column = xVariance <= yVariance
    console.log(column ? "COL" : "ROW")

    // Now that we know the layout, find which children in this axis we are
    // between
    const childPositions = column ? yCoords : xCoords
    const mousePosition = column ? mouseY : mouseX

    let idx = 0
    while (idx < children.length && childPositions[idx] < mousePosition) {
      idx++
    }

    placeholderInfo = {
      parent: id,
      index: idx,
    }
    // // When no edges match, drop inside if possible
    // if (!sides.length) {
    //   if (empty) {
    //     console.log("allowed inside")
    //     return {
    //       ...dropInfo,
    //       mode: "inside",
    //       side: null,
    //       bounds,
    //     }
    //   } else {
    //     // No sides but also not empty?
    //     console.log("no sides match, but not empty")
    //     return null
    //   }
    // }
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

    // Do nothing if this is the placeholder
    // if (element.dataset.id === "placeholder") {
    //   console.log("placeholder")
    //   return
    // }

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

      // Ensure the dragging flag is always set.
      // There's a bit of a race condition between the app reinitialisation
      // after selecting the DND component and setting this the first time
      // if (!get(builderStore).isDragging) {
      //   builderStore.actions.setDragging(true)
      // }

      // Precompute and store some info to avoid recalculating everything in
      // dragOver
      dropInfo = {
        id: component.dataset.id,
        parent: component.dataset.parent,
        index: parseInt(component.dataset.index),
        node: getDOMNode(component.dataset.id),
        empty: component.classList.contains("empty"),
        acceptsChildren: component.classList.contains("parent"),
      }

      // console.log(
      //   "enter",
      //   component.dataset.name,
      //   "id",
      //   dropInfo.id,
      //   "parent",
      //   dropInfo.parent,
      //   "index",
      //   dropInfo.index
      // )

      handleEvent(e)
    } else {
      // dropInfo = null
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

<!--<DNDPositionIndicator-->
<!--  {dropInfo}-->
<!--  color="var(&#45;&#45;spectrum-global-color-static-green-500)"-->
<!--  zIndex="940"-->
<!--  transition-->
<!--/>-->
