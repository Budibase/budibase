<script>
  export let bounds
  export let mode
  export let zIndex

  $: x = bounds?.left
  $: y = getYPos(bounds, mode)
  $: width = bounds?.width
  $: valid = bounds != null

  const getYPos = (bounds, mode) => {
    if (!bounds || !mode) {
      return null
    }
    const { top, height } = bounds
    return mode === "above" ? top - 2 : top + height
  }
</script>

{#if valid}
  <div
    class="indicator"
    style={`top:${y}px;left:${x}px;width:${width}px;z-index:${zIndex};`}
  />
{/if}

<style>
  .indicator {
    position: absolute;
    height: 2px;
    background: var(--spectrum-global-color-static-green-500);
  }
</style>
