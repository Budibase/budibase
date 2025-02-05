<script>
  import { onMount } from "svelte"
  import { Utils } from "@budibase/frontend-core"
  import { dndInitialised } from "@/stores"
  import { DNDPlaceholderID } from "@/constants"

  let left, top, height, width
  let observing = false

  // Observe style changes in the placeholder DOM node and use this to trigger
  // a redraw of our overlay (grid screens)
  const observer = new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === "style")) {
      debouncedUpdate()
    }
  })

  const updatePosition = () => {
    const wrapperNode = document.getElementsByClassName(DNDPlaceholderID)[0]
    let domNode = wrapperNode
    const insideGrid = wrapperNode?.dataset.insideGrid === "true"
    if (!insideGrid) {
      domNode = document.getElementsByClassName(`${DNDPlaceholderID}-dom`)[0]
    }
    if (!domNode) {
      height = 0
      width = 0
    } else {
      const bounds = domNode.getBoundingClientRect()
      left = bounds.left
      top = bounds.top
      height = bounds.height
      width = bounds.width
    }

    // Initialise observer if not already done
    if (!observing && wrapperNode) {
      observing = true
      observer.observe(wrapperNode, { attributes: true })
    }
  }
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  onMount(() => {
    const interval = setInterval(debouncedUpdate, 100)
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  })
</script>

{#if left != null && top != null && width && height && $dndInitialised}
  <div
    class="overlay"
    style="left: {left}px; top: {top}px; width: {width}px; height: {height}px;"
  />
{/if}

<style>
  .overlay {
    position: fixed;
    z-index: 800;
    background: hsl(160, 64%, 90%);
    border-radius: 4px;
    border: 2px solid var(--spectrum-global-color-static-green-500);
  }
</style>
