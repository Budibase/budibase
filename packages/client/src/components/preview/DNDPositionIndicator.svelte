<script>
  import Indicator from "./Indicator.svelte"

  export let componentId
  export let dropInfo
  export let mode
  export let zIndex
  export let color
  export let transition

  $: dimensions = getDimensions(dropInfo?.bounds, mode)
  $: prefix = mode === "above" ? "Above" : "Below"
  $: text = `${prefix} ${dropInfo?.name}`

  const getDimensions = (bounds, mode) => {
    if (!bounds || !mode) {
      return null
    }
    const { left, top, width, height } = bounds
    return {
      top: mode === "above" ? top - 4 : top + height,
      left: left - 2,
      width: width + 4,
    }
  }
</script>

{#key `${componentId}-${mode}`}
  {#if dimensions && mode !== "inside"}
    <Indicator
      left={dimensions.left}
      top={dimensions.top}
      width={dimensions.width}
      height={0}
      {text}
      {zIndex}
      {color}
      {transition}
      line
    />
  {/if}
{/key}
