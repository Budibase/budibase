<script>
  import Indicator from "./Indicator.svelte"
  import { Sides } from "./DNDHandler.svelte"

  export let dropInfo
  export let zIndex
  export let color
  export let transition

  $: dimensions = getDimensions(dropInfo)
  $: prefix = dropInfo?.mode === "above" ? "Before" : "After"
  $: text = `${prefix} ${dropInfo?.name}`
  $: renderKey = `${dropInfo?.target}-${dropInfo?.side}`

  const getDimensions = info => {
    const { bounds, side } = info ?? {}
    if (!bounds || !side) {
      return null
    }
    const { left, top, width, height } = bounds
    if (side === Sides.Top || side === Sides.Bottom) {
      return {
        top: side === Sides.Top ? top - 4 : top + height,
        left: left - 2,
        width: width + 4,
        height: 0,
      }
    } else {
      return {
        top: top - 2,
        left: side === Sides.Left ? left - 4 : left + width,
        width: 0,
        height: height + 4,
      }
    }
  }
</script>

{#key renderKey}
  {#if dimensions && dropInfo?.mode !== "inside"}
    <Indicator
      left={Math.round(dimensions.left)}
      top={Math.round(dimensions.top)}
      width={dimensions.width}
      height={dimensions.height}
      {text}
      {zIndex}
      {color}
      {transition}
      alignRight={dropInfo?.side === Sides.Right}
      line
    />
  {/if}
{/key}
