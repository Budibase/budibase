<script>
  import { onMount, onDestroy } from "svelte"
  import Indicator from "./Indicator.svelte"
  import { domDebounce } from "utils/domDebounce"
  import { builderStore } from "stores"

  export let componentId
  export let color
  export let transition
  export let zIndex
  export let prefix = null
  export let allowResizeAnchors = false

  let indicators = []
  let interval
  let text
  let icon
  let insideGrid = false
  let errorState = false

  $: visibleIndicators = indicators.filter(x => x.visible)
  $: offset = $builderStore.inBuilder ? 0 : 2

  let updating = false
  let observers = []
  let callbackCount = 0
  let nextIndicators = []

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
    nextIndicators[idx].visible =
      nextIndicators[idx].insideSidePanel || entries[0].isIntersecting
    if (++callbackCount === observers.length) {
      indicators = nextIndicators
      updating = false
    }
  }

  const updatePosition = () => {
    if (updating) {
      return
    }

    // Sanity check
    if (!componentId) {
      indicators = []
      return
    }

    // Reset state
    updating = true
    callbackCount = 0
    observers.forEach(o => o.disconnect())
    observers = []
    nextIndicators = []

    // Check if we're inside a grid
    if (allowResizeAnchors) {
      insideGrid = checkInsideGrid(componentId)
    }

    // Determine next set of indicators
    const parents = document.getElementsByClassName(componentId)
    if (parents.length) {
      text = parents[0].dataset.name
      if (prefix) {
        text = `${prefix} ${text}`
      }
      if (parents[0].dataset.icon) {
        icon = parents[0].dataset.icon
      }
    }
    errorState = parents?.[0]?.classList.contains("error")

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
      indicators = []
      updating = false
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
      nextIndicators.push({
        top: elBounds.top + scrollY - deviceBounds.top - offset,
        left: elBounds.left + scrollX - deviceBounds.left - offset,
        width: elBounds.width + 4,
        height: elBounds.height + 4,
        visible: false,
        insideSidePanel: !!child.closest(".side-panel"),
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

{#key componentId}
  {#each visibleIndicators as indicator, idx}
    <Indicator
      top={indicator.top}
      left={indicator.left}
      width={indicator.width}
      height={indicator.height}
      text={idx === 0 ? text : null}
      icon={idx === 0 ? icon : null}
      showResizeAnchors={allowResizeAnchors && insideGrid}
      color={errorState ? "var(--spectrum-global-color-static-red-600)" : color}
      {componentId}
      {transition}
      {zIndex}
    />
  {/each}
{/key}
