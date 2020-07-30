<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  /* 
    ISSUES
    - Renders but seems to be a problem with tooltip hover
  */

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  const chart = britecharts.groupedBar()
  const chartClass = `groupedbar-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let tooltip
  let tooltipContainer
  let chartElement = null
  let chartContainer = null

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (dataPoint, topicColorMap, dataPointXPosition) =>
    tooltip.update(dataPoint, topicColorMap, dataPointXPosition)
  export let customMouseOut = () => tooltip.hide()
  export let customClick = null

  export let data = []
  export let color = "britecharts"
  export let height = 200
  export let width = 200
  export let margin = { top: 0, right: 0, bottom: 0, left: 0 }
  export let aspectRatio = null
  export let grid = null
  export let groupLabel = null
  export let isAnimated = null
  export let isHorizontal = null
  export let nameLabel = null
  export let valueLabel = null
  export let valueLabelFormat = null
  export let xTicks = null
  export let yAxisLabel = null
  export let yAxisLabelOffset = null
  export let yTicks = null
  export let yTickTextOffset = null
  export let useLegend = true

  onMount(() => {
    if (chart) {
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      //   bindChartEvents()
      chartContainer.datum(data).call(chart)
      //   bindChartTooltip()
    }
  })

  function bindChartUIProps() {
    if (notNull(color)) {
      chart.colorSchema(colorSchema)
    }
    if (notNull(height)) {
      chart.height(height)
    }
    if (notNull(width)) {
      chart.width(width)
    }
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(grid)) {
      chart.grid(grid)
    }
    if (notNull(groupLabel)) {
      chart.groupLabel(groupLabel)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(isHorizontal)) {
      chart.isHorizontal(isHorizontal)
    }
    if (notNull(nameLabel)) {
      chart.nameLabel(nameLabel)
    }
    if (notNull(valueLabel)) {
      chart.valueLabel(valueLabel)
    }
    if (notNull(valueLabelFormat)) {
      chart.valueLabelFormat(valueLabelFormat)
    }
    if (notNull(xTicks)) {
      chart.xTicks(xTicks)
    }
    if (notNull(yAxisLabel)) {
      chart.yAxisLabel(yAxisLabel)
    }
    if (notNull(yAxisLabelOffset)) {
      chart.yAxisLabelOffset(yAxisLabelOffset)
    }
    if (notNull(yTicks)) {
      chart.yTicks(yTicks)
    }
    if (notNull(yTickTextOffset)) {
      chart.yTickTextOffset(yTickTextOffset)
    }
  }

  function bindChartTooltip() {
    tooltip = britecharts.miniTooltip()
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  }

  function bindChartEvents() {
    if (customClick) {
      chart.on("customClick", customClick)
    }
    if (customMouseMove) {
      chart.on("customMouseMove", customMouseMove)
    }
    if (customMouseOut) {
      chart.on("customMouseOut", customMouseOut)
    }
    if (customMouseOver) {
      chart.on("customMouseOver", customMouseOver)
    }
  }

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
