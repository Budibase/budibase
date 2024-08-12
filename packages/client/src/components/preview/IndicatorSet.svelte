<script>
  import { onMount, onDestroy } from "svelte"
  import Indicator from "./Indicator.svelte"
  import { builderStore } from "stores"
  import { memo, Utils } from "@budibase/frontend-core"
  import { isGridChild } from "utils/grid"

  export let componentId = null
  export let color = null
  export let zIndex = 900
  export let prefix = null
  export let allowResizeAnchors = false

  // Offset = 6 (clip-root padding) - 1 (half the border thickness)
  const config = memo($$props)
  const errorColor = "var(--spectrum-global-color-static-red-600)"
  const defaultState = () => ({
    // Cached props
    componentId,
    color,
    zIndex,
    prefix,
    allowResizeAnchors,

    // Computed state
    indicators: [],
    text: null,
    icon: null,
    insideGrid: false,
    error: false,
  })

  let interval
  let state = defaultState()
  let observing = false
  let updating = false
  let observers = []
  let callbackCount = 0
  let nextState

  $: visibleIndicators = state.indicators.filter(x => x.visible)
  $: offset = $builderStore.inBuilder ? 5 : -1
  $: config.set({
    componentId,
    color,
    zIndex,
    prefix,
    allowResizeAnchors,
  })

  // Update position when any props change
  $: $config, debouncedUpdate()

  // Observe style changes
  $: observeChanges(componentId)

  const observer = new MutationObserver(() => debouncedUpdate())

  const observeChanges = id => {
    observer.disconnect()
    observing = false
    const node = document.getElementsByClassName(id)[0]
    if (node) {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["style"],
        childList: false,
        subtree: false,
      })
      observing = true
    }
  }

  const checkInsideGrid = id => {
    return isGridChild(document.getElementsByClassName(id)[0])
  }

  const createIntersectionCallback = idx => entries => {
    if (callbackCount >= observers.length) {
      return
    }
    nextState.indicators[idx].visible =
      nextState.indicators[idx].insideModal ||
      nextState.indicators[idx].insideSidePanel ||
      entries[0].isIntersecting
    if (++callbackCount === observers.length) {
      state = nextState
      updating = false
    }
  }

  const updatePosition = () => {
    if (updating) {
      return
    }

    // Sanity check
    if (!componentId) {
      state = defaultState()
      return
    }
    const parents = document.getElementsByClassName(componentId)
    if (!parents.length) {
      state = defaultState()
      return
    }
    updating = true
    callbackCount = 0
    observers.forEach(o => o.disconnect())
    observers = []
    nextState = defaultState()

    // Start observing if this is the first time we've seen our component
    // in the DOM
    if (!observing) {
      observeChanges(componentId)
    }

    // Check if we're inside a grid
    if (allowResizeAnchors) {
      nextState.insideGrid = checkInsideGrid(componentId)
    }

    // Get text to display
    nextState.text = parents[0].dataset.name
    if (nextState.prefix) {
      nextState.text = `${nextState.prefix} ${nextState.text}`
    }
    if (parents[0].dataset.icon) {
      nextState.icon = parents[0].dataset.icon
    }
    nextState.error = parents[0].classList.contains("error")

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Extract valid children
    // Sanity limit of active indicators
    const className = nextState.insideGrid ? componentId : `${componentId}-dom`
    const children = Array.from(document.getElementsByClassName(className))
      .filter(x => x != null)
      .slice(0, 100)
    const multi = children.length > 1

    // If there aren't any nodes then reset
    if (!children.length) {
      state = defaultState()
      return
    }

    const device = document.getElementById("app-root")
    const deviceBounds = device.getBoundingClientRect()
    nextState.indicators = children.map((child, idx) => {
      const elBounds = child.getBoundingClientRect()
      let indicator = {
        top: Math.round(elBounds.top + scrollY - deviceBounds.top + offset),
        left: Math.round(elBounds.left + scrollX - deviceBounds.left + offset),
        width: Math.round(elBounds.width + 2),
        height: Math.round(elBounds.height + 2),
        visible: true,
      }

      // If observing more than one node then we need to use an intersection
      // observer to determine whether each indicator should be visible
      if (multi) {
        const callback = createIntersectionCallback(idx)
        const observer = new IntersectionObserver(callback, {
          threshold: 1,
          root: device,
        })
        observer.observe(child)
        observers.push(observer)
        indicator.visible = false
        indicator.insideSidePanel = !!child.closest(".side-panel")
        indicator.insideModal = !!child.closest(".modal-content")
      }

      return indicator
    })

    // Immediately apply the update if we're just observing a single node
    if (!multi) {
      state = nextState
      updating = false
    }
  }
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    observer.disconnect()
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
  })
</script>

{#each visibleIndicators as indicator, idx}
  <Indicator
    top={indicator.top}
    left={indicator.left}
    width={indicator.width}
    height={indicator.height}
    text={idx === 0 ? state.text : null}
    icon={idx === 0 ? state.icon : null}
    showResizeAnchors={state.allowResizeAnchors && state.insideGrid}
    color={state.error ? errorColor : state.color}
    componentId={state.componentId}
    zIndex={state.zIndex}
  />
{/each}
