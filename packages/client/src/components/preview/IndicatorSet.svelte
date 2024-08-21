<script>
  import { onMount, onDestroy } from "svelte"
  import Indicator from "./Indicator.svelte"
  import { builderStore } from "stores"
  import { memo, Utils } from "@budibase/frontend-core"

  export let componentId = null
  export let color = null
  export let zIndex = 900
  export let prefix = null
  export let allowResizeAnchors = false

  // Offset = 6 (clip-root padding) - 1 (half the border thickness)
  const config = memo($$props)
  const errorColor = "var(--spectrum-global-color-static-red-600)"
  const mutationObserver = new MutationObserver(() => debouncedUpdate())
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
  let observingMutations = false
  let updating = false
  let intersectionObservers = []
  let callbackCount = 0
  let nextState

  $: componentId, reset()
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

  const reset = () => {
    mutationObserver.disconnect()
    observingMutations = false
    updating = false
  }

  const observeMutations = element => {
    mutationObserver.observe(element, {
      attributes: true,
      attributeFilter: ["style"],
    })
    observingMutations = true
  }

  const createIntersectionCallback = idx => entries => {
    if (callbackCount >= intersectionObservers.length) {
      return
    }
    nextState.indicators[idx].visible =
      nextState.indicators[idx].insideModal ||
      nextState.indicators[idx].insideSidePanel ||
      entries[0].isIntersecting
    if (++callbackCount === intersectionObservers.length) {
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
    let elements = document.getElementsByClassName(componentId)
    if (!elements.length) {
      state = defaultState()
      return
    }
    updating = true
    callbackCount = 0
    intersectionObservers.forEach(o => o.disconnect())
    intersectionObservers = []
    nextState = defaultState()

    // Start observing mutations if this is the first time we've seen our
    // component in the DOM
    if (!observingMutations) {
      observeMutations(elements[0])
    }

    // Check if we're inside a grid
    if (allowResizeAnchors) {
      nextState.insideGrid = elements[0]?.dataset.insideGrid === "true"
    }

    // Get text to display
    nextState.text = elements[0].dataset.name
    if (nextState.prefix) {
      nextState.text = `${nextState.prefix} ${nextState.text}`
    }
    if (elements[0].dataset.icon) {
      nextState.icon = elements[0].dataset.icon
    }
    nextState.error = elements[0].classList.contains("error")

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Extract valid children
    // Sanity limit of active indicators
    if (!nextState.insideGrid) {
      elements = document.getElementsByClassName(`${componentId}-dom`)
    }
    elements = Array.from(elements)
      .filter(x => x != null)
      .slice(0, 100)
    const multi = elements.length > 1

    // If there aren't any nodes then reset
    if (!elements.length) {
      state = defaultState()
      return
    }

    const device = document.getElementById("app-root")
    const deviceBounds = device.getBoundingClientRect()
    nextState.indicators = elements.map((element, idx) => {
      const elBounds = element.getBoundingClientRect()
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
        const intersectionObserver = new IntersectionObserver(callback, {
          threshold: 1,
          root: device,
        })
        intersectionObserver.observe(element)
        intersectionObservers.push(intersectionObserver)
        indicator.visible = false
        indicator.insideSidePanel = !!element.closest(".side-panel")
        indicator.insideModal = !!element.closest(".modal-content")
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
    mutationObserver.disconnect()
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
