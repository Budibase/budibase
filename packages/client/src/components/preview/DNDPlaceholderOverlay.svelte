<script>
  import { onMount } from "svelte"
  import { DNDPlaceholderID } from "constants"
  import { Utils } from "@budibase/frontend-core"

  let left, top, height, width

  const updatePosition = () => {
    let node = document.getElementsByClassName(DNDPlaceholderID)[0]
    const insideGrid = node?.dataset.insideGrid === "true"
    if (!insideGrid) {
      node = document.getElementsByClassName(`${DNDPlaceholderID}-dom`)[0]
    }
    if (!node) {
      height = 0
      width = 0
    } else {
      const bounds = node.getBoundingClientRect()
      left = bounds.left
      top = bounds.top
      height = bounds.height
      width = bounds.width
    }
  }
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  onMount(() => {
    const interval = setInterval(debouncedUpdate, 100)
    return () => {
      clearInterval(interval)
    }
  })
</script>

{#if left != null && top != null && width && height}
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
    transition: all 130ms ease-out;
    border: 2px solid var(--spectrum-global-color-static-green-500);
  }
</style>
