<script>
  import {
    getColorSchema,
    getChartGradient,
    notNull,
    hasProp,
  } from "./utils.js"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  let tooltip
  const _id = shortid.generate()
  const chart = britecharts.bar()
  const chartClass = `bar-container-${_id}`

  let chartElement = null
  let chartContainer = null
  let tooltipContainer = null

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (datapoint, colorMapping, x, y) =>
    tooltip.update(datapoint, colorMapping, x, y)
  export let customMouseOut = () => tooltip.hide()
  export let customClick = null

  let data = []
  export let xAxisLabel = ""
  export let yAxisLabel = ""
  export let betweenBarsPadding = 0.1 //takes decimal values 0.1, 0.5 etc
  export let gradient = null
  export let color = "britecharts"
  export let enableLabels = false
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
    if (model) {
      await fetchData()
      data = $store[model]
      if (schemaIsValid()) {
        chartContainer = select(`.${chartClass}`)
        bindChartUIProps()
        bindChartEvents()
        chartContainer.datum(data).call(chart)
        bindChartTooltip()
      } else {
        console.error("Bar Chart - Please provide a valid name and value label")
      }
    }
  })

  const schemaIsValid = () =>
    (hasProp(data, "name") || hasProp(data, nameLabel)) &&
    (hasProp(data, "value") || hasProp(data, valueLabel))

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
    chart.numberFormat(".0f")
    chart.labelsNumberFormat(".1f")

    if (notNull(color)) {
      chart.colorSchema(colorSchema)
    }
    if (notNull(gradient)) {
      chart.chartGradient(chartGradient)
    }
    if (notNull(xAxisLabel)) {
      chart.xAxisLabel(xAxisLabel)
    }
    if (notNull(yAxisLabel)) {
      chart.yAxisLabel(yAxisLabel)
    }
    if (notNull(betweenBarsPadding)) {
      chart.betweenBarsPadding(Number(betweenBarsPadding))
    }
    if (notNull(enableLabels)) {
      chart.enableLabels(enableLabels)
    }
    if (notNull(hasPercentage)) {
      chart.hasPercentage(hasPercentage)
    }
    if (notNull(hasSingleBarHighlight)) {
      chart.hasSingleBarHighlight(hasSingleBarHighlight)
    }
    if (notNull(labelsMargin)) {
      chart.labelsMargin(labelsMargin)
    }
    if (notNull(height)) {
      chart.height(height)
    }
    if (notNull(highlightBarFunction)) {
      chart.highlightBarFunction(highlightBarFunction)
    }
    if (notNull(width)) {
      chart.width(width)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(isHorizontal)) {
      chart.isHorizontal(isHorizontal)
    }
    if (notNull(yAxisLabelOffset)) {
      chart.yAxisLabelOffset(yAxisLabelOffset)
    }
    if (notNull(xAxisLabelOffset)) {
      chart.xAxisLabelOffset(Number(xAxisLabelOffset))
    }
    if (notNull(labelsNumberFormat)) {
      chart.labelsNumberFormat(labelsNumberFormat)
    }
    if (notNull(valueLabel)) {
      chart.valueLabel(valueLabel)
    }
    if (notNull(locale)) {
      chart.locale(locale)
    }
    if (notNull(nameLabel)) {
      chart.nameLabel(nameLabel)
    }
    if (notNull(numberFormat)) {
      chart.numberFormat(numberFormat)
    }
    if (notNull(labelsSize)) {
      chart.labelsSize(labelsSize)
    }
    if (notNull(xTicks)) {
      chart.xTicks(xTicks)
    }
    if (notNull(yTicks)) {
      chart.yTicks(yTicks)
    }
    if (notNull(percentageAxisToMaxRatio)) {
      chart.percentageAxisToMaxRatio(percentageAxisToMaxRatio)
    }
    chartContainer.datum(data).call(chart)
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
    tooltip.numberFormat(".0f")
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  }

  $: colorSchema = getColorSchema(color)
  $: chartGradient = getChartGradient(gradient)
</script>

<div bind:this={chartElement} class={chartClass} />
