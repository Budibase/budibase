<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import Indicator from "./Indicator.svelte"
  import { builderStore } from "@/stores"
  import { memo, Utils } from "@budibase/frontend-core"

  export let componentId: string
  export let color: string
  export let zIndex: number = 900
  export let prefix: string | undefined = undefined
  export let allowResizeAnchors: boolean = false
  export let background: string | undefined = undefined
  export let animate: boolean = false
  export let text: string | undefined = undefined
  export let icon: string | undefined = undefined

  interface IndicatorState {
    visible: boolean
    insideModal: boolean
    insideSidePanel: boolean
    top: number
    left: number
    width: number
    height: number
  }

  interface IndicatorSetState {
    // Cached props
    componentId: string
    color: string
    zIndex: number
    prefix?: string
    allowResizeAnchors: boolean

    // Computed state
    indicators: IndicatorState[]
    text?: string
    icon?: string
    insideGrid: boolean
    error: boolean
  }

  const config = memo($$props)
  const errorColor = "var(--spectrum-global-color-static-red-600)"
  const mutationObserver = new MutationObserver(() => debouncedUpdate())
  const defaultState = (): IndicatorSetState => ({
    componentId,
    color,
    zIndex,
    prefix,
    allowResizeAnchors,
    indicators: [],
    text,
    icon,
    insideGrid: false,
    error: false,
  })

  let interval: ReturnType<typeof setInterval>
  let state = defaultState()
  let observingMutations = false
  let updating = false
  let intersectionObservers: IntersectionObserver[] = []
  let callbackCount = 0
  let nextState: ReturnType<typeof defaultState>

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

  const getElements = (className: string): HTMLElement[] => {
    return [...document.getElementsByClassName(className)]
      .filter(el => el instanceof HTMLElement)
      .slice(0, 100)
  }

  const observeMutations = (node: Node) => {
    mutationObserver.observe(node, {
      attributes: true,
      attributeFilter: ["style"],
    })
    observingMutations = true
  }

  const createIntersectionCallback =
    (idx: number) => (entries: IntersectionObserverEntry[]) => {
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
    let elements = getElements(componentId)
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
    nextState.insideGrid = elements[0]?.dataset.insideGrid === "true"

    // Get text and icon to display
    if (!text) {
      nextState.text = elements[0].dataset.name
      if (nextState.prefix) {
        nextState.text = `${nextState.prefix} ${nextState.text}`
      }
    }
    if (!icon) {
      if (elements[0].dataset.icon) {
        nextState.icon = elements[0].dataset.icon
      }
    }
    nextState.error = elements[0].classList.contains("error")

    // Batch reads to minimize reflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Extract valid children
    // Sanity limit of active indicators
    if (!nextState.insideGrid) {
      elements = getElements(`${componentId}-dom`)
    }
    const multi = elements.length > 1

    // If there aren't any nodes then reset
    if (!elements.length) {
      state = defaultState()
      return
    }

    const device = document.getElementById("app-root")
    if (!device) {
      throw "app-root node not found"
    }
    const deviceBounds = device.getBoundingClientRect()
    nextState.indicators = elements.map((element, idx) => {
      const elBounds = element.getBoundingClientRect()
      let indicator: IndicatorState = {
        top: Math.round(elBounds.top + scrollY - deviceBounds.top + offset),
        left: Math.round(elBounds.left + scrollX - deviceBounds.left + offset),
        width: Math.round(elBounds.width + 2),
        height: Math.round(elBounds.height + 2),
        visible: true,
        insideModal: false,
        insideSidePanel: false,
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
    text={idx === 0 ? state.text : undefined}
    icon={idx === 0 ? state.icon : undefined}
    showResizeAnchors={state.allowResizeAnchors && state.insideGrid}
    color={state.error ? errorColor : state.color}
    componentId={state.componentId}
    zIndex={state.zIndex}
    {background}
    {animate}
  />
{/each}
