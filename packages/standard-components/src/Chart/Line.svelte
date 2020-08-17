<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import sort from "fast-sort"
  import Tooltip from "./Tooltip.svelte"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"
  import { log } from "console"

  const _id = shortid.generate()

  export let _bb
  export let model

  let store = _bb.store

  const chart = britecharts.line()
  const chartClass = `line-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let data = { data: [] }

  let chartElement
  let chartContainer
  let tooltip
  let tooltipContainer

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (
    dataPoint,
    topicColorMap,
    dataPointXPosition
  ) => {
    tooltip.update(dataPoint, topicColorMap, dataPointXPosition)
  }
  export let customMouseOut = () => tooltip.hide()

  export let customDataEntryClick = null
  export let customTouchMove = null

  export let color = "britecharts"
  export let axisTimeCombinations = ""
  export let grid = "horizontal"
  export let aspectRatio = 0.5
  export let width = null
  export let height = null
  export let isAnimated = true
  export let lineCurve = "linear" //see api for possible opts
  export let lineGradient = null
  export let locale = "en-GB"
  export let numberFormat = ""
  export let shouldShowAllDataPoints = true
  export let topicLabel = null
  export let dateLabel = "date"
  export let valueLabel = null
  export let xAxisLabel = ""
  export let xAxisValueType = "date"
  export let xAxisScale = "linear"
  export let xAxisFormat = "day-month"
  export let xAxisCustomFormat = "%H"
  export let yAxisLabel = null
  export let yAxisLabelPadding = null
  export let lines = null //not handled by setting prop
  export let tooltipThreshold = null
  export let tooltipTitle = ""

  let chartDrawn = false

  onMount(async () => {
    if (chart) {
      data = await getAndPrepareData()
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      chartContainer.datum(data).call(chart)
      chartDrawn = true
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

  async function getAndPrepareData() {
    let dataByTopic = []
    let _data = []

    if (!topicLabel) {
      topicLabel = "topic"
    }

    if (!valueLabel) {
      valueLabel = "value"
    }

    if (!dateLabel) {
      dateLabel = "date"
    }

    if (model) {
      await fetchData()
      _data = $store[model]
    }

    _data.forEach((data, idx, arr) => {
      let topicName = data[topicLabel]
      if (!dataByTopic.some(dt => dt.topicName === topicName)) {
        let d = {
          topicName,
          topic: dataByTopic.length + 1,
          dates: arr
            .filter(d => d[topicLabel] === topicName)
            .map(d => ({ date: new Date(d[dateLabel]), value: d[valueLabel] })),
        }
        d.dates = d.dates.sort((a, b) => a.date - b.date)
        dataByTopic.push(d)
      }
    })

    return { dataByTopic }
  }

  $: console.table("DATA", data)

  function bindChartUIProps() {
    chart.grid("horizontal")
    chart.isAnimated(true)
    // chart.tooltipThreshold(800)

    if (notNull(color)) {
      chart.colorSchema(colorSchema)
    }
    if (notNull(lineGradient)) {
      chart.lineGradient(chartGradient)
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
    if (notNull(tooltipThreshold)) {
      chart.tooltipThreshold(tooltipThreshold)
    }
    if (notNull(lines)) {
      chart.lines(lines)
    }
  }

  function bindChartEvents() {
    if (customMouseOver) {
      chart.on("customMouseOver", customMouseOver)
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

  $: colorSchema = getColorSchema(color)
  $: chartGradient = getChartGradient(lineGradient)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if chartDrawn}
  <Tooltip
    bind:tooltip
    title={tooltipTitle || 'Line Tooltip'}
    topicLabel="topics"
    {chartClass} />
{/if}
