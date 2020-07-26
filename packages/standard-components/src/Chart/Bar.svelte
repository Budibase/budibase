<script>
  import Chart, { getColorSchema, getChartGradient } from "./Chart.svelte"

  /*
    ISSUES:
    nameLabel, valueLabel - what are these? Seem to break whenever passed a string or number. What type?
    https://github.com/britecharts/britecharts/blob/a2c45ab023112b36e14f47c278e3a1e1c05f8383/src/charts/bar.js#L145
  */

  let type = "bar"
  let tooltip

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (datapoint, colorMapping, x, y) =>
    tooltip.update(datapoint, colorMapping, x, y)
  export let customMouseOut = () => tooltip.hide()
  export let customClick = null

  export let data = []
  export let xAxisLabel = ""
  export let yAxisLabel = ""
  export let betweenBarsPadding = 5
  export let gradient = null
  export let color = "britecharts"
  export let enableLabels = true
  export let hasSingleBarHighlight = true
  export let height = 200
  export let width = 300
  export let isAnimated = true
  export let isHorizontal = true
  export let labelOffset = null
  export let labelsNumberFormat = null
  export let labelSize = null
  export let locale = null
  export let nameLabel = null
  export let numberFormat = null

  export let useLegend = true

  $: colorSchema = getColorSchema(color)
  $: chartGradient = getChartGradient(gradient)
</script>

<Chart
  bind:tooltip
  {type}
  {data}
  on={{ customClick, customMouseMove, customMouseOut, customMouseOver }}
  useTooltip
  {useLegend}
  {betweenBarsPadding}
  {chartGradient}
  {colorSchema}
  {enableLabels}
  {hasSingleBarHighlight}
  {height}
  {width}
  {isAnimated}
  {isHorizontal}
  {labelOffset}
  {labelsNumberFormat}
  {labelSize}
  {locale}
  {nameLabel}
  {numberFormat}
  {xAxisLabel}
  {yAxisLabel} />
