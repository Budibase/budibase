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

  const chart = britecharts.stackedArea()
  const chartClass = `stackedarea-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (
    dataPoint,
    colorMapping,
    xPosition,
    yPosition = null
  ) => tooltip.update(dataPoint, colorMapping, xPosition, (yPosition = null))
  export let customMouseOut = () => tooltip.hide()

  export let data = []
  export let color = "britecharts"
  export let height = null
  export let width = null
  export let margin = null
  export let areaCurve = null
  export let areaOpacity = null
  export let aspectRatio = null
  export let dateLabel = null
  export let grid = null
  export let isAnimated = null
  export let keyLabel = null
  export let locale = null
  export let tooltipThreshold = null
  export let topicsOrder = null
  export let valueLabel = null
  export let xAxisCustomFormat = null
  export let xAxisFormat = null
  export let xAxisScale = null
  export let xAxisValueType = null
  export let xTicks = null
  export let yAxisBaseline = null
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
      chart.margin(margin)
    }
    if (notNull(areaCurve)) {
      chart.areaCurve(areaCurve)
    }
    if (notNull(areaOpacity)) {
      chart.areaOpacity(areaOpacity)
    }
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(dateLabel)) {
      chart.dateLabel(dateLabel)
    }
    if (notNull(grid)) {
      chart.grid(grid)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(keyLabel)) {
      chart.keyLabel(keyLabel)
    }
    if (notNull(locale)) {
      chart.locale(locale)
    }
    if (notNull(tooltipThreshold)) {
      chart.tooltipThreshold(tooltipThreshold)
    }
    if (notNull(topicsOrder)) {
      chart.topicsOrder(topicsOrder)
    }
    if (notNull(valueLabel)) {
      chart.valueLabel(valueLabel)
    }
    if (notNull(xAxisCustomFormat)) {
      chart.xAxisCustomFormat(xAxisCustomFormat)
    }
    if (notNull(xAxisFormat)) {
      chart.xAxisFormat(xAxisFormat)
    }
    if (notNull(xAxisScale)) {
      chart.xAxisScale(xAxisScale)
    }
    if (notNull(xAxisValueType)) {
      chart.xAxisValueType(xAxisValueType)
    }
    if (notNull(xTicks)) {
      chart.xTicks(xTicks)
    }
    if (notNull(yAxisBaseline)) {
      chart.yAxisBaseline(yAxisBaseline)
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

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
