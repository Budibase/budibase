<script>
  import { getColorSchema, getChartGradient, notNull, hasProp } from "./utils"
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

  let data = { dataByTopic: [] }

  let chartElement
  let chartContainer
  let tooltipContainer

  let tooltip = britecharts.tooltip()

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (
    dataPoint,
    topicColorMap,
    dataPointXPosition,
    yPosition
  ) => {
    tooltip.update(dataPoint, topicColorMap, dataPointXPosition, yPosition)
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
    if (model) {
      data = await getAndPrepareData()
      if (data.dataByTopic.length > 0) {
        chartContainer = select(`.${chartClass}`)
        bindChartUIProps()
        bindChartEvents()
        chartContainer.datum(data).call(chart)
        chartDrawn = true
        bindTooltip()
      } else {
        console.error(
          "Line Chart - Please provide valid name, value and topic labels"
        )
      }
    }
  })

  function bindTooltip() {
    tooltipContainer = select(
      `.${chartClass} .metadata-group .vertical-marker-container`
    )
    tooltip.topicLabel("topics")
    tooltipContainer.datum([]).call(tooltip)
  }

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

  const schemaIsValid = data =>
    hasProp(data, valueLabel) &&
    hasProp(data, dateLabel) &&
    hasProp(data, topicLabel)

  async function getAndPrepareData() {
    let dataByTopic = []
    let _data = []

    if (!topicLabel) {
      topicLabel = "topicName"
    }

    if (!valueLabel) {
      valueLabel = "value"
    }

    if (!dateLabel) {
      dateLabel = "date"
    }

    await fetchData()
    _data = $store[model]

    if (schemaIsValid(_data)) {
      _data.forEach((data, idx, arr) => {
        let topicName = data[topicLabel]
        if (!dataByTopic.some(dt => dt.topicName === topicName)) {
          let d = {
            topicName,
            topic: dataByTopic.length + 1,
            dates: arr
              .filter(d => d[topicLabel] === topicName)
              .map(d => ({
                date: new Date(d[dateLabel]),
                value: d[valueLabel],
              }))
              .sort((a, b) => a.date - b.date),
          }
          dataByTopic.push(d)
        }
      })
    }

    return { dataByTopic }
  }

  function bindChartUIProps() {
    chart.grid("horizontal")
    chart.isAnimated(true)
    chart.tooltipThreshold(800)
    chart.aspectRatio(0.5)
    chart.xAxisCustomFormat("custom")

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

    tooltip.title(tooltipTitle || "Line Tooltip")
  }

  function bindChartEvents() {
    if (customMouseOver) {
      chart.on("customMouseOver", tooltip.show)
    }
    if (customMouseMove) {
      chart.on("customMouseMove", tooltip.update)
    }
    if (customMouseOut) {
      chart.on("customMouseOut", tooltip.hide)
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
