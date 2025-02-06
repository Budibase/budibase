<!--<script>-->
<!--  import { onMount, tick } from "svelte"-->
<!--  import { Utils } from "@budibase/frontend-core"-->
<!--  import { componentStore, dndNewComponentType, isGridScreen } from "@/stores"-->
<!--  import { DNDPlaceholderID } from "@/constants"-->
<!--  import IndicatorSet from "@/components/preview/IndicatorSet.svelte"-->

<!--  let left, top, height, width-->
<!--  let observing = false-->
<!--  let hasGridStyles = false-->

<!--  // On grid screens, we need to wait for grid styles to be properly set on-->
<!--  // the hidden placeholder component before rendering this overlay-->
<!--  $: waitingForGrid = $isGridScreen && !hasGridStyles-->
<!--  $: instance = componentStore.actions.getComponentInstance(DNDPlaceholderID)-->
<!--  $: state = $instance?.state-->
<!--  $: styles = $state?.styles?.normal || {}-->
<!--  $: {-->
<!--    if ($isGridScreen && !hasGridStyles) {-->
<!--      checkGridStyles(styles)-->
<!--    }-->
<!--  }-->

<!--  // We pull the component name from the definition-->
<!--  $: definition =-->
<!--    componentStore.actions.getComponentDefinition($dndNewComponentType)-->

<!--  // Wait for grid styles to be set, then tick and await a position update-->
<!--  // before finally signalling we're allowed to render-->
<!--  const checkGridStyles = async styles => {-->
<!--    const hasStyles = Object.keys(styles).some(key => key.startsWith("&#45;&#45;grid"))-->
<!--    if (hasStyles) {-->
<!--      await tick()-->
<!--      updatePosition()-->
<!--      hasGridStyles = true-->
<!--    }-->
<!--  }-->

<!--  // Observe style changes in the placeholder DOM node and use this to trigger-->
<!--  // a redraw of our overlay-->
<!--  const observer = new MutationObserver(mutations => {-->
<!--    if (mutations.some(mutation => mutation.attributeName === "style")) {-->
<!--      debouncedUpdate()-->
<!--    }-->
<!--  })-->

<!--  const updatePosition = () => {-->
<!--    const wrapperNode = document.getElementsByClassName(DNDPlaceholderID)[0]-->
<!--    let domNode = wrapperNode-->
<!--    const insideGrid = wrapperNode?.dataset.insideGrid === "true"-->
<!--    if (!insideGrid) {-->
<!--      domNode = document.getElementsByClassName(`${DNDPlaceholderID}-dom`)[0]-->
<!--    }-->
<!--    if (!domNode) {-->
<!--      height = 0-->
<!--      width = 0-->
<!--    } else {-->
<!--      const bounds = domNode.getBoundingClientRect()-->
<!--      left = bounds.left-->
<!--      top = bounds.top-->
<!--      height = bounds.height-->
<!--      width = bounds.width-->
<!--    }-->

<!--    // Initialise observer if not already done-->
<!--    if (!observing && wrapperNode) {-->
<!--      observing = true-->
<!--      observer.observe(wrapperNode, { attributes: true })-->
<!--    }-->
<!--  }-->
<!--  const debouncedUpdate = Utils.domDebounce(updatePosition)-->

<!--  onMount(() => {-->
<!--    const interval = setInterval(debouncedUpdate, 100)-->
<!--    return () => {-->
<!--      observer.disconnect()-->
<!--      clearInterval(interval)-->
<!--    }-->
<!--  })-->
<!--</script>-->

<!--&lt;!&ndash;{#if left != null && top != null && width && height && !waitingForGrid}&ndash;&gt;-->
<!--&lt;!&ndash;  <div&ndash;&gt;-->
<!--&lt;!&ndash;    class="overlay"&ndash;&gt;-->
<!--&lt;!&ndash;    class:animate={!$isGridScreen}&ndash;&gt;-->
<!--&lt;!&ndash;    style="left:{left}px; top:{top}px; width:{width}px; height:{height}px;"&ndash;&gt;-->
<!--&lt;!&ndash;  >&ndash;&gt;-->
<!--&lt;!&ndash;    {definition?.name || ""}&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;  <IndicatorSet componentId={DNDPlaceholderID} color="red" />&ndash;&gt;-->

<!--&lt;!&ndash;{/if}&ndash;&gt;-->
<!--<style>-->
<!--  .overlay {-->
<!--    position: fixed;-->
<!--    z-index: 800;-->
<!--    background: hsl(160, 64%, 90%);-->
<!--    border-radius: 4px;-->
<!--    border: 2px solid var(&#45;&#45;spectrum-global-color-static-green-500);-->
<!--    display: grid;-->
<!--    place-items: center;-->
<!--    color: hsl(160, 64%, 40%);-->
<!--    font-size: 14px;-->
<!--  }-->
<!--  .overlay.animate {-->
<!--    transition: all 130ms ease-out;-->
<!--  }-->
<!--</style>-->
