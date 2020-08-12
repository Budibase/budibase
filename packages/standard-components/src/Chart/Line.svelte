<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import Tooltip from "./Tooltip.svelte"
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

  const testData = {
    data: [
      {
        topicName: "Oakland",
        name: 2,
        date: "2017-01-16T16:00:00-08:00",
        value: 3,
      },
      {
        topicName: "Oakland",
        name: 2,
        date: "2017-01-17T16:00:00-08:00",
        value: 7,
      },
      {
        topicName: "Oakland",
        name: 2,
        date: "2017-01-18T16:00:00-08:00",
        value: 5,
      },
      {
        topicName: "Oakland",
        name: 2,
        date: "2017-01-19T16:00:00-08:00",
        value: 6,
      },
      {
        topicName: "Oakland",
        name: 2,
        date: "2017-01-20T16:00:00-08:00",
        value: 1,
      },
    ],
  }

  let data = testData

  let chartElement
  let chartContainer
  let tooltip
  let tooltipContainer

  export let customMouseOver = null //() => tooltip.show()
  export let customMouseMove = null //(dataPoint, topicColorMap, dataPointXPosition) =>
  //tooltip.update(dataPoint, topicColorMap, dataPointXPosition)
  export let customMouseOut = null //() => tooltip.hide()

  export let customDataEntryClick = null
  export let customTouchMove = null

  export let color = "britecharts"
  export let axisTimeCombinations = ""
  export let grid = "horizontal"
  export let aspectRatio = 0.5
  export let dateLabel = "date"
  export let width = null
  export let height = null
  export let isAnimated = true
  export let lineCurve = "linear" //see api for possible opts
  export let lineGradient = null
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
  export let yAxisLabelPadding = null
  export let lines = null //not handled by setting prop
  export let tooltipThreshold = null

  let chartDrawn = false

  onMount(async () => {
    if (chart) {
      // data = await getAndPrepareData()
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
    let data = []
    if (model) {
      await fetchData()
      data = $store[model]
    }
    return { data }
  }

  $: console.log("DATA", data)

  function bindChartUIProps() {
    chart.grid("horizontal")
    chart.dateLabel("date")
    chart.aspectRatio(0.5)
    chart.isAnimated(true)

    // if (notNull(color)) {
    //   //chart.colorSchema(colorSchema)
    // }
    // if (notNull(lineGradient)) {
    //   chart.lineGradient(chartGradient)
    // }
    // if (notNull(axisTimeCombinations)) {
    //   chart.axisTimeCombinations(axisTimeCombinations)
    // }
    // if (notNull(grid)) {
    //   chart.grid(grid)
    // }
    // if (notNull(aspectRatio)) {
    //   chart.aspectRatio(aspectRatio)
    // }
    // if (notNull(dateLabel)) {
    //   chart.dateLabel(dateLabel)
    // }
    // if (notNull(width)) {
    //   chart.width(width)
    // }
    // if (notNull(height)) {
    //   chart.height(height)
    // }
    // if (notNull(isAnimated)) {
    //   chart.isAnimated(isAnimated)
    // }
    // if (notNull(lineCurve)) {
    //   chart.lineCurve(lineCurve)
    // }
    // if (notNull(locale)) {
    //   chart.locale(locale)
    // }
    // if (notNull(numberFormat)) {
    //   chart.numberFormat(numberFormat)
    // }
    // if (notNull(shouldShowAllDataPoints)) {
    //   chart.shouldShowAllDataPoints(shouldShowAllDataPoints)
    // }
    // if (notNull(topicLabel)) {
    //   chart.topicLabel(topicLabel)
    // }
    // if (notNull(valueLabel)) {
    //   chart.valueLabel(valueLabel)
    // }
    // if (notNull(xAxisLabel)) {
    //   chart.xAxisLabel(xAxisLabel)
    // }
    // if (notNull(xAxisValueType)) {
    //   chart.xAxisValueType(xAxisValueType)
    // }
    // if (notNull(xAxisScale)) {
    //   chart.xAxisScale(xAxisScale)
    // }
    // if (notNull(xAxisFormat)) {
    //   chart.xAxisFormat(xAxisFormat)
    // }
    // if (notNull(xAxisCustomFormat)) {
    //   chart.xAxisCustomFormat(xAxisCustomFormat)
    // }
    // if (notNull(yAxisLabel)) {
    //   chart.yAxisLabel(yAxisLabel)
    // }
    // if (notNull(yAxisLabelPadding)) {
    //   chart.yAxisLabelPadding(yAxisLabelPadding)
    // }
    // if (notNull(tooltipThreshold)) {
    //   chart.tooltipThreshold(tooltipThreshold)
    // }
    // if (notNull(lines)) {
    //   chart.lines(lines)
    // }
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
<!-- {#if chartDrawn}
  <Tooltip bind:tooltip {valueLabel} {chartClass} />
{/if} -->
