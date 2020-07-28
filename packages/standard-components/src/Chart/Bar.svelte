<script>
  import { getColorSchema, getChartGradient } from "./Chart.svelte"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"
  /*
    ISSUES:
    nameLabel, valueLabel - what are these? Seem to break whenever passed a string or number. What type?
    https://github.com/britecharts/britecharts/blob/a2c45ab023112b36e14f47c278e3a1e1c05f8383/src/charts/bar.js#L145
  */

  let tooltip
  const _id = shortid.generate()
  const chart = britecharts.bar()
  const chartClass = `bar-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null
  let tooltipContainer = null

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

  onMount(() => {
    //call charts props in here
    if (chartElement) {
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      bindChartTooltip()
      chartContainer.datum(data).call(chart)
    }
  })

  function bindChartUIProps() {
    if (color) {
      chart.colorSchema(colorSchema)
    }
    if (gradient) {
      chart.chartGradient(chartGradient)
    }
    if (xAxisLabel) {
      chart.xAxisLabel(xAxisLabel)
    }
    if (yAxisLabel) {
      chart.yAxisLabel(yAxisLabel)
    }
    if (betweenBarsPadding) {
      chart.betweenBarsPadding(betweenBarsPadding)
    }
    if (enableLabels) {
      chart.enableLabels(enableLabels)
    }
    if (hasSingleBarHighlight) {
      chart.hasSingleBarHighlight(hasSingleBarHighlight)
    }
    if (height) {
      chart.height(height)
    }
    if (width) {
      chart.width(width)
    }
    if (isAnimated) {
      chart.isAnimated(isAnimated)
    }
    if (isHorizontal) {
      chart.isHorizontal(isHorizontal)
    }
    if (labelOffset) {
      chart.labelOffset(labelOffset)
    }
    if (labelsNumberFormat) {
      chart.labelsNumberFormat(labelsNumberFormat)
    }
    if (labelSize) {
      chart.labelSize(labelSize)
    }
    if (locale) {
      chart.locale(locale)
    }
    if (nameLabel) {
      chart.nameLabel(nameLabel)
    }
    if (numberFormat) {
      chart.numberFormat(numberFormat)
    }
  }

  function bindChartEvents() {
    if (customMouseMove) {
      chart.on("customMouseMove", customMouseMove)
    }
    if (customMouseOut) {
      chart.on("customMouseOut", customMouseOut)
    }
    if (customMouseOver) {
      chart.on("customMouseOver", customMouseOver)
    }
    if (customClick) {
      chart.on("customClick", customClick)
    }
  }

  function bindChartTooltip() {
    tooltip = britecharts.miniTooltip()
    debugger
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  }

  $: colorSchema = getColorSchema(color)
  $: chartGradient = getChartGradient(gradient)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
