<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  const chart = britecharts.stackedBar()
  const chartClass = `stackedbar-container-${_id}`
  const legendClass = `legend-container-${_id}`

  export let _bb
  export let model

  let store = _bb.store

  let chartElement = null
  let chartContainer = null
  let tooltip
  let tooltipContainer

  export let customMouseOver = () => tooltip.show()
  export let customMouseMove = (dataPoint, colorMapping, xPosition) =>
    tooltip.update(dataPoint, colorMapping, xPosition)
  export let customMouseOut = () => tooltip.hide()

  export let data = []
  export let color = "britecharts"
  export let height = null
  export let width = null
  export let margin = null
  export let aspectRatio = null
  export let betweenBarsPadding = null
  export let grid = null
  export let hasPercentage = null
  export let hasReversedStacks = null
  export let isAnimated = null
  export let isHorizontal = null
  export let locale = null
  export let nameLabel = null
  export let percentageAxisToMaxRatio = null
  export let stackLabel = null
  export let valueLabel = null
  export let valueLabelFormat = null
  export let xTicks = null
  export let yTicks = null
  export let yAxisLabel = null
  export let yAxisLabelOffset = null
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
      //   bindChartTooltip()
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
    //UI PROPS
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
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(betweenBarsPadding)) {
      chart.betweenBarsPadding(betweenBarsPadding)
    }
    if (notNull(grid)) {
      chart.grid(grid)
    }
    if (notNull(hasPercentage)) {
      chart.hasPercentage(hasPercentage)
    }
    if (notNull(hasReversedStacks)) {
      chart.hasReversedStacks(hasReversedStacks)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(isHorizontal)) {
      chart.isHorizontal(isHorizontal)
    }
    if (notNull(locale)) {
      chart.locale(locale)
    }
    if (notNull(nameLabel)) {
      chart.nameLabel(nameLabel)
    }
    if (notNull(percentageAxisToMaxRatio)) {
      chart.percentageAxisToMaxRatio(percentageAxisToMaxRatio)
    }
    if (notNull(stackLabel)) {
      chart.stackLabel(stackLabel)
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
    if (notNull(yTicks)) {
      chart.yTicks(yTicks)
    }
    if (notNull(yAxisLabel)) {
      chart.yAxisLabel(yAxisLabel)
    }
    if (notNull(yAxisLabelOffset)) {
      chart.yAxisLabelOffset(yAxisLabelOffset)
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

  function bindChartTooltip() {
    tooltip = britecharts.tooltip()
    // tooltip.topicLabel("Hi Im the topic")
    // tooltip.topicsOrder(["x", "y"])
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
