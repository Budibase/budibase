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

  let indicators = []
  let interval
  let text
  let icon

  $: visibleIndicators = indicators.filter(x => x.visible)
  $: offset = $builderStore.inBuilder ? 0 : 2

  let updating = false
  let observers = []
  let callbackCount = 0
  let nextIndicators = []

  const createIntersectionCallback = idx => entries => {
    if (callbackCount >= observers.length) {
      return
    }
    nextIndicators[idx].visible = entries[0].isIntersecting
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

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Extract valid children
    // Sanity limit of 100 active indicators
    const children = Array.from(parents)
      .map(parent => parent?.children?.[0])
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
      {transition}
      {zIndex}
      {color}
    />
  {/each}
{/key}
