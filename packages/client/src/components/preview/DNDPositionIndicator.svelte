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
  $: icon = dropInfo?.icon
  $: renderKey = `${dropInfo?.target}-${dropInfo?.side}`

  const getDimensions = info => {
    const { bounds, side } = info ?? {}
    if (!bounds || !side) {
      return null
    }

    // Get preview offset
    const root = document.getElementById("clip-root")
    const rootBounds = root.getBoundingClientRect()

    // Subtract preview offset from bounds
    let { left, top, width, height } = bounds
    left -= rootBounds.left
    top -= rootBounds.top

    // Determine position
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
      {icon}
      {zIndex}
      {color}
      {transition}
      alignRight={dropInfo?.side === Sides.Right}
      line
    />
  {/if}
{/key}
