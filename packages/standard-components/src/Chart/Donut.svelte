<script>
  import Chart, { getColorSchema } from "./Chart.svelte"

  let type = "donut"

  export let data = []
  export let color = "britecharts"
  export let height = 200
  export let width = 200
  export let margin = { top: 0, right: 0, bottom: 0, left: 0 }

  export let externalRadius = 25
  export let hasFixedHighlightedSlice = false
  export let hasLastHoverSliceHighlighted = false
  export let internalRadius = 25
  export let isAnimated = true
  export let radiusHoverOffset = 0
  export let useLegend = true

  $: colorSchema = getColorSchema(color)
</script>

<Chart
  {type}
  {useLegend}
  {data}
  {colorSchema}
  {height}
  {width}
  {margin}
  {externalRadius}
  {hasFixedHighlightedSlice}
  {hasLastHoverSliceHighlighted}
  {internalRadius}
  {isAnimated}
  {radiusHoverOffset} />
