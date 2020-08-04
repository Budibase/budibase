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
  export let hasPercentage = null
  export let hasSingleBarHighlight = true
  export let highlightBarFunction = null
  export let height = 200
  export let width = 300
  export let labelsMargin = null
  export let isAnimated = true
  export let isHorizontal = true
  export let xAxisLabelOffset = null
  export let yAxisLabelOffset = null
  export let labelsNumberFormat = null
  export let locale = null
  export let valueLabel = null
  export let nameLabel = null
  export let numberFormat = null
  export let labelsSize = null
  export let xTicks = null
  export let yTicks = null
  export let percentageAxisToMaxRatio = null

  export let useLegend = true

  export let _bb
  export let model

  let store = _bb.store

  onMount(async () => {
    if (chartElement) {
      await fetchData()
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
      chart.betweenBarsPadding(Number(betweenBarsPadding))
    }
    if (enableLabels) {
      chart.enableLabels(enableLabels)
    }
    if (hasPercentage) {
      chart.hasPercentage(hasPercentage)
    }
    if (hasSingleBarHighlight) {
      chart.hasSingleBarHighlight(hasSingleBarHighlight)
    }
    if (labelsMargin) {
      chart.labelsMargin(labelsMargin)
    }
    if (height) {
      chart.height(height)
    }
    if (highlightBarFunction) {
      chart.highlightBarFunction(highlightBarFunction)
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
    if (yAxisLabelOffset) {
      chart.yAxisLabelOffset(Number(yAxisLabelOffset))
    }
    if (xAxisLabelOffset) {
      chart.xAxisLabelOffset(Number(xAxisLabelOffset))
    }
    if (labelsNumberFormat) {
      chart.labelsNumberFormat(labelsNumberFormat)
    }
    if (valueLabel) {
      chart.valueLabel(valueLabel)
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
    if (labelsSize) {
      chart.labelsSize(labelsSize)
    }
    if (xTicks) {
      chart.xTicks(xTicks)
    }
    if (yTicks) {
      chart.yTicks(yTicks)
    }
    if (percentageAxisToMaxRatio) {
      chart.percentageAxisToMaxRatio(percentageAxisToMaxRatio)
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
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  }

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
  $: chartGradient = getChartGradient(gradient)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
