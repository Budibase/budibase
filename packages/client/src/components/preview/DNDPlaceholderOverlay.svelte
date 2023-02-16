<script>
  import { onMount } from "svelte"
  import { DNDPlaceholderID } from "constants"
  import { domDebounce } from "utils/domDebounce.js"

  let left, top, height, width

  const updatePosition = () => {
    const node =
      document.getElementsByClassName(DNDPlaceholderID)[0]?.childNodes[0]
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
  const debouncedUpdate = domDebounce(updatePosition)

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
