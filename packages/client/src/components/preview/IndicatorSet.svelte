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
  let nextState = null
  let updating = false
  let observers = []
  let callbackCount = 0

  $: offset = $builderStore.inBuilder ? 5 : -1
  $: visibleIndicators = state.indicators.filter(x => x.visible)

  // Update position when any props change
  $: config.set({
    componentId,
    color,
    zIndex,
    prefix,
    allowResizeAnchors,
  })
  $: $config, debouncedUpdate()

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

    // Reset state
    updating = true
    callbackCount = 0
    observers.forEach(o => o.disconnect())
    observers = []
    nextState = defaultState()

    // Check if we're inside a grid
    if (allowResizeAnchors) {
      nextState.insideGrid = checkInsideGrid(componentId)
    }

    // Determine next set of indicators
    const parents = document.getElementsByClassName(componentId)
    if (parents.length) {
      nextState.text = parents[0].dataset.name
      if (nextState.prefix) {
        nextState.text = `${nextState.prefix} ${nextState.text}`
      }
      if (parents[0].dataset.icon) {
        nextState.icon = parents[0].dataset.icon
      }
    }
    nextState.error = parents?.[0]?.classList.contains("error")

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Extract valid children
    // Sanity limit of 100 active indicators
    const className = nextState.insideGrid ? componentId : `${componentId}-dom`
    const children = Array.from(document.getElementsByClassName(className))
      .filter(x => x != null)
      .slice(0, 100)

    // If there aren't any nodes then reset
    if (!children.length) {
      state = defaultState()
      updating = false
      return
    }

    const device = document.getElementById("app-root")
    const deviceBounds = device.getBoundingClientRect()
    children.forEach((child, idx) => {
      const callback = createIntersectionCallback(idx)
      const threshold = children.length > 1 ? 1 : 0
      const observer = new IntersectionObserver(callback, {
        threshold,
        root: device,
      })
      observer.observe(child)
      observers.push(observer)
      const elBounds = child.getBoundingClientRect()
      nextState.indicators.push({
        top: Math.round(elBounds.top + scrollY - deviceBounds.top + offset),
        left: Math.round(elBounds.left + scrollX - deviceBounds.left + offset),
        width: Math.round(elBounds.width + 2),
        height: Math.round(elBounds.height + 2),
        visible: false,
        insideSidePanel: !!child.closest(".side-panel"),
        insideModal: !!child.closest(".modal-content"),
      })
    })
  }
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
    observers.forEach(o => o.disconnect())
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
