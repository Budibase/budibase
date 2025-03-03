<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { get } from "svelte/store"
  import { builderStore, screenStore, dndStore, isGridScreen } from "@/stores"
  import { Utils } from "@budibase/frontend-core"
  import { findComponentById } from "@/utils/components.js"
  import { isGridEvent } from "@/utils/grid"
  import { DNDPlaceholderID } from "@/constants"
  import type { Component } from "@budibase/types"

  type ChildCoords = {
    placeholder: boolean
    centerX: number
    centerY: number
    left: number
    right: number
    top: number
    bottom: number
  }

  const ThrottleRate = 130

  // Cache some dnd store state as local variables as it massively helps
  // performance. It lets us avoid calling svelte getters on every DOM action.
  $: source = $dndStore.source
  $: target = $dndStore.target
  $: drop = $dndStore.drop
  $: gridScreen = $isGridScreen

  // Local flag for whether we are awaiting an async drop event
  let dropping = false

  // Util to get the inner DOM element by a component ID
  const getDOMElement = (id: string): HTMLElement | undefined => {
    const el = document.getElementsByClassName(`${id}-dom`)[0]
    return el instanceof HTMLElement ? el : undefined
  }

  // Util to calculate the variance of a set of data
  const variance = (arr: number[]) => {
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
    if (dropping) {
      return
    }

    // Reset listener
    if (source?.id) {
      const component = document.getElementsByClassName(source?.id)[0]
      if (component) {
        component.removeEventListener("dragend", stopDragging)
      }
    }

    // Reset state
    dndStore.actions.reset()
  }

  // Callback when initially starting a drag on a draggable component
  const onDragStart = (e: DragEvent) => {
    if (isGridEvent(e)) {
      return
    }
    if (!(e.target instanceof HTMLElement)) {
      return
    }
    const component = e.target.closest(".component")
    if (
      !(component instanceof HTMLElement) ||
      !component.classList.contains("draggable")
    ) {
      return
    }

    // Hide drag ghost image
    e.dataTransfer?.setDragImage(new Image(), 0, 0)

    // Add event handler to clear all drag state when dragging ends
    component.addEventListener("dragend", stopDragging)

    // Update state
    const id = component.dataset.id!
    const parentId = component.dataset.parent!
    const parent: Component = findComponentById(
      get(screenStore).activeScreen?.props,
      parentId
    )
    const index = parent._children!.findIndex(child => child._id === id)
    dndStore.actions.startDraggingExistingComponent({
      id,
      bounds: component.children[0].getBoundingClientRect(),
      parent: parentId,
      index,
      name: component.dataset.name,
      icon: component.dataset.icon,
      type: parent._children![index]!._component,
    })
    builderStore.actions.selectComponent(id)

    // Set initial drop info to show placeholder exactly where the dragged
    // component is.
    // Execute this asynchronously to prevent bugs caused by updating state in
    // the same handler as selecting a new component (which causes a client
    // re-initialisation).
    setTimeout(() => {
      dndStore.actions.updateDrop({
        parent: parentId,
        index,
      })
    }, 0)
  }

  // Core logic for handling drop events and determining where to render the
  // drop target placeholder
  const processEvent = Utils.throttle((mouseX: number, mouseY: number) => {
    if (!target) {
      return
    }
    let { id, parent, element, acceptsChildren, empty } = target

    // If we're over something that does not accept children then we go up a
    // level and consider the mouse position relative to the parent
    if (!acceptsChildren) {
      id = parent
      empty = false
      element = getDOMElement(parent)
    }

    // We're now hovering over something which does accept children.
    // If it is empty, just go inside it.
    if (empty) {
      dndStore.actions.updateDrop({
        parent: id,
        index: 0,
      })
      return
    }

    // As the first DOM element in a component may not necessarily contain the
    // child components, we can find to try the parent of the first child
    // component and use that as the real parent DOM node
    const childElement = element?.getElementsByClassName("component")[0]
    if (childElement?.parentNode instanceof HTMLElement) {
      element = childElement.parentNode
    }

    // Append an ephemeral div to allow us to determine layout if only one
    // child exists
    let ephemeralDiv
    if (element?.children.length === 1) {
      ephemeralDiv = document.createElement("div")
      ephemeralDiv.dataset.id = DNDPlaceholderID
      element.appendChild(ephemeralDiv)
    }

    // We're now hovering over something which accepts children and is not
    // empty, so we need to work out where to inside the placeholder
    // Calculate the coordinates of various locations on each child.
    const childCoords: ChildCoords[] = [...(element?.children || [])]
      .filter(el => el instanceof HTMLElement)
      .map(el => {
        const child = el.children?.[0] || el
        const bounds = child.getBoundingClientRect()
        return {
          placeholder: el.dataset.id === DNDPlaceholderID,
          centerX: bounds.left + bounds.width / 2,
          centerY: bounds.top + bounds.height / 2,
          left: bounds.left,
          right: bounds.right,
          top: bounds.top,
          bottom: bounds.bottom,
        }
      })

    // Now that we've calculated the position of the children, we no longer need
    // the ephemeral div
    if (ephemeralDiv) {
      element?.removeChild(ephemeralDiv)
    }

    // Calculate the variance between each set of positions on the children
    const variances = Object.keys(childCoords[0] || {})
      .filter(key => key !== "placeholder")
      .map(key => {
        const numericalKey = key as keyof Omit<ChildCoords, "placeholder">
        const coords = childCoords.map(x => x[numericalKey])
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
    const column = ["centerX", "left", "right"].includes(variances[0]?.side)

    // Calculate breakpoints between child components so we can determine the
    // index to drop the component in.
    // We want to ignore the placeholder from this calculation as it should not
    // be considered a real child of the parent.
    const breakpoints = childCoords
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
    dndStore.actions.updateDrop({
      parent: id,
      index: idx,
    })
  }, ThrottleRate)

  const handleEvent = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    processEvent(e.clientX, e.clientY)
  }

  // Callback when on top of a component
  const onDragOver = (e: DragEvent) => {
    if (!source || !target || gridScreen) {
      return
    }
    handleEvent(e)
  }

  // Callback when entering a potential drop target
  const onDragEnter = async (e: DragEvent) => {
    if (!source || gridScreen || !(e.target instanceof HTMLElement)) {
      return
    }

    // Find the next valid component to consider dropping over, ignoring nested
    // block components
    let comp = e.target.closest?.(`.component:not(.block):not(.${source.id})`)
    if (!(comp instanceof HTMLElement)) {
      return
    }
    if (comp?.classList.contains("droppable")) {
      dndStore.actions.updateTarget({
        id: comp.dataset.id!,
        parent: comp.dataset.parent!,
        element: getDOMElement(comp.dataset.id!),
        empty: comp.classList.contains("empty"),
        acceptsChildren: comp.classList.contains("parent"),
      })
      handleEvent(e)
    }
  }

  // Callback when dropping a drag on top of some component
  const onDrop = async () => {
    if (!source || !drop?.parent || drop?.index == null) {
      return
    }

    // Check if we're adding a new component rather than moving one
    if (source.isNew) {
      dropping = true
      builderStore.actions.dropNewComponent(
        source.type,
        drop.parent,
        drop.index,
        $dndStore.meta?.props
      )
      dropping = false
      stopDragging()
      return
    }

    // Convert parent + index into target + mode
    let legacyDropTarget, legacyDropMode
    const parent: Component | null = findComponentById(
      get(screenStore).activeScreen?.props,
      drop.parent
    )
    if (!parent) {
      return
    }

    // Do nothing if we didn't change the location
    if (source.parent === drop.parent && source.index === drop.index) {
      return
    }

    // Filter out source component and placeholder from consideration
    const children = parent._children?.filter(
      x => x._id !== DNDPlaceholderID && x._id !== source.id
    )

    // Use inside if no existing children
    if (!children?.length) {
      legacyDropTarget = parent._id
      legacyDropMode = "inside"
    } else if (drop.index === 0) {
      legacyDropTarget = children[0]?._id
      legacyDropMode = "above"
    } else {
      legacyDropTarget = children[drop.index - 1]?._id
      legacyDropMode = "below"
    }

    if (legacyDropTarget && legacyDropMode) {
      dropping = true
      await builderStore.actions.moveComponent(
        source.id,
        legacyDropTarget,
        legacyDropMode
      )
      dropping = false
      stopDragging()
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
