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

  const chart = britecharts.line()
  const chartClass = `line-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement
  let chartContainer
  let tooltip
  let tooltipContainer

  export let customMouseHover = null
  export let customMouseMove = null
  export let customMouseOut = null
  export let customDataEntryClick = null
  export let customTouchMove = null

  export let data = []
  export let color = "britecharts"
  export let axisTimeCombinations = ""
  export let grid = "horizontal"
  export let aspectRatio = 0.5
  export let dateLabel = "date"
  export let width = null
  export let height = null
  export let isAnimated = true
  export let lineCurve = "linear" //see api for possible opts
  export let locale = "en-GB"
  export let numberFormat = ""
  export let shouldShowAllDataPoints = true
  export let topicLabel = null
  export let valueLabel = null
  export let xAxisLabel = ""
  export let xAxisValueType = "date"
  export let xAxisScale = "linear"
  export let xAxisFormat = "day-month"
  export let xAxisCustomFormat = "%H"
  export let yAxisLabel = null
  export let useLegend = true
  export let yAxisLabelPadding = null
  export let lines = null //not handled by setting prop
  export let tooltipThreshold = null

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
    if (notNull(axisTimeCombinations)) {
      chart.axisTimeCombinations(axisTimeCombinations)
    }
    if (notNull(grid)) {
      chart.grid(grid)
    }
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(dateLabel)) {
      chart.dateLabel(dateLabel)
    }
    if (notNull(width)) {
      chart.width(width)
    }
    if (notNull(height)) {
      chart.height(height)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(lineCurve)) {
      chart.lineCurve(lineCurve)
    }
    if (notNull(locale)) {
      chart.locale(locale)
    }
    if (notNull(numberFormat)) {
      chart.numberFormat(numberFormat)
    }
    if (notNull(shouldShowAllDataPoints)) {
      chart.shouldShowAllDataPoints(shouldShowAllDataPoints)
    }
    if (notNull(topicLabel)) {
      chart.topicLabel(topicLabel)
    }
    if (notNull(valueLabel)) {
      chart.valueLabel(valueLabel)
    }
    if (notNull(xAxisLabel)) {
      chart.xAxisLabel(xAxisLabel)
    }
    if (notNull(xAxisValueType)) {
      chart.xAxisValueType(xAxisValueType)
    }
    if (notNull(xAxisScale)) {
      chart.xAxisScale(xAxisScale)
    }
    if (notNull(xAxisFormat)) {
      chart.xAxisFormat(xAxisFormat)
    }
    if (notNull(xAxisCustomFormat)) {
      chart.xAxisCustomFormat(xAxisCustomFormat)
    }
    if (notNull(yAxisLabel)) {
      chart.yAxisLabel(yAxisLabel)
    }
    if (notNull(yAxisLabelPadding)) {
      chart.yAxisLabelPadding(yAxisLabelPadding)
    }
  }

  function bindChartEvents() {
    if (customMouseHover) {
      chart.on("customMouseHover", customMouseHover)
    }
    if (customMouseMove) {
      chart.on("customMouseMove", customMouseMove)
    }
    if (customMouseOut) {
      chart.on("customMouseOut", customMouseOut)
    }
    if (customDataEntryClick) {
      chart.on("customDataEntryClick", customDataEntryClick)
    }
    if (customTouchMove) {
      chart.on("customTouchMove", customTouchMove)
    }
  }

  function bindChartTooltip() {
    tooltip = britecharts.miniTooltip()

    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  }

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}

<!-- 

isAnimated={true}
aspectRatio={0.5}
grid='horizontal'
tooltipThreshold={600}
width={600}
dateLabel='fullDate'

 {type}
  {data}
  {colorSchema}
  {axisTimeCombinations}
  {lineCurve}
  {numberFormat}
  {height}
  {topicLabel}
  {shouldShowAllDataPoints}
  {xAxisLabel}
  {valueLabel}
  {xAxisValueType}
  {xAxisScale}
  {xAxisCustomFormat}

 -->
