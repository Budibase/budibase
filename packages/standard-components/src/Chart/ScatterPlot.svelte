<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  export let _bb
  export let model

  let store = _bb.store

  const chart = britecharts.scatterPlot()
  const chartClass = `scatterplot-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null
  let tooltip
  let tooltipContainer

  export let customClick = null
  export let customMouseOut = () => tooltip.hide()
  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (dataPoint, colorMapping, xPosition, yPosition = null) =>
    tooltip.update(dataPoint, colorMapping, xPosition, (yPosition = null))

  export let data = []
  export let color = "britecharts"
  export let height = null
  export let width = null
  export let margin = null
  export let aspectRatio = null
  export let circleOpacity = null
  export let grid = null
  export let hasCrossHairs = null
  export let hasHollowCircles = null
  export let hasTrendline = null
  export let highlightTextLegendOffset = null
  export let isAnimated = null
  export let maxCircleArea = null
  export let xAxisFormat = null
  export let xAxisLabel = null
  export let xAxisLabelOffset = null
  export let xTicks = null
  export let yAxisFormat = null
  export let yAxisLabel = null
  export let yAxisLabelOffset = null
  export let yTicks = null
  export let useLegend = true

  onMount(async () => {
    if (chart) {
      if (model) {
        await fetchData()
      }
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      chartContainer.datum(_data).call(chart)
      bindChartTooltip()
    }
  })

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/views/all_${model}`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()
      store.update(state => {
        state[model] = json
        return state
      })
    } else {
      throw new Error("Failed to fetch records.", response)
    }
  }

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
    if (notNull(margin)) {
      chart.width(margin)
    }
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(circleOpacity)) {
      chart.circleOpacity(circleOpacity)
    }
    if (notNull(grid)) {
      chart.grid(grid)
    }
    if (notNull(hasCrossHairs)) {
      chart.hasCrossHairs(hasCrossHairs)
    }
    if (notNull(hasHollowCircles)) {
      chart.hasHollowCircles(hasHollowCircles)
    }
    if (notNull(hasTrendline)) {
      chart.hasTrendline(hasTrendline)
    }
    if (notNull(highlightTextLegendOffset)) {
      chart.highlightTextLegendOffset(highlightTextLegendOffset)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(maxCircleArea)) {
      chart.maxCircleArea(maxCircleArea)
    }
    if (notNull(xAxisFormat)) {
      chart.xAxisFormat(xAxisFormat)
    }
    if (notNull(xAxisLabel)) {
      chart.xAxisLabel(xAxisLabel)
    }
    if (notNull(xAxisLabelOffset)) {
      chart.xAxisLabelOffset(xAxisLabelOffset)
    }
    if (notNull(xTicks)) {
      chart.xTicks(xTicks)
    }
    if (notNull(yAxisFormat)) {
      chart.yAxisFormat(yAxisFormat)
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

  function bindChartTooltip() {
    //TODO: May be more apt to use tooltip() here. Currently erroring however
    tooltip = britecharts.miniTooltip()
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    // tooltip
    //   .title("Temperature")
    //   .valueLabel("y")
    //   .nameLabel("x")
    //   .numberFormat("$")
    tooltipContainer.datum([]).call(tooltip)
  }

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
