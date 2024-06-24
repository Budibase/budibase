<script>
  import { onMount, onDestroy } from "svelte"
  import Indicator from "./Indicator.svelte"
  import { domDebounce } from "utils/domDebounce"
  import { builderStore } from "stores"

  export let componentId = null
  export let color = null
  export let zIndex = 900
  export let prefix = null
  export let allowResizeAnchors = false

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

  $: visibleIndicators = state.indicators.filter(x => x.visible)
  $: offset = $builderStore.inBuilder ? 0 : 2
  $: $$props, debouncedUpdate()

  const checkInsideGrid = id => {
    const component = document.getElementsByClassName(id)[0]
    const domNode = component?.children[0]

    // Ignore grid itself
    if (domNode?.classList.contains("grid")) {
      return false
    }

    return component?.parentNode
      ?.closest?.(".component")
      ?.childNodes[0]?.classList.contains("grid")
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
    const children = Array.from(
      document.getElementsByClassName(`${componentId}-dom`)
    )
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
        top: elBounds.top + scrollY - deviceBounds.top - offset,
        left: elBounds.left + scrollX - deviceBounds.left - offset,
        width: elBounds.width + 4,
        height: elBounds.height + 4,
        visible: false,
        insideSidePanel: !!child.closest(".side-panel"),
        insideModal: !!child.closest(".modal-content"),
      })
    })
  }
  const debouncedUpdate = domDebounce(updatePosition)

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
