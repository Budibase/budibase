<script>
  import { getColorSchema, getChartGradient, notNull, hasProp } from "./utils"
  import Tooltip from "./Tooltip.svelte"
  import fetchData from "../fetchData.js"
  import britecharts from "britecharts"
  import { onMount } from "svelte"
  import { select } from "d3-selection"
  import shortid from "shortid"
  import { isEmpty } from "lodash/fp"

  const _id = shortid.generate()

  const chart = britecharts.groupedBar()
  const chartClass = `groupedbar-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let tooltip = britecharts.tooltip()
  let tooltipContainer
  let chartElement = null
  let chartContainer = null

  export let customClick = null

  let data = []
  export let datasource = {}
  export let color = "britecharts"
  export let height = 200
  export let width = 200
  export let margin = null
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
  export let tooltipTitle = ""

  const schemaIsValid = () =>
    (hasProp(data, "name") || hasProp(data, nameLabel)) &&
    (hasProp(data, "group") || hasProp(data, groupLabel)) &&
    (hasProp(data, "value") || hasProp(data, valueLabel))

  onMount(async () => {
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource)
      if (schemaIsValid()) {
        chartContainer = select(`.${chartClass}`)
        bindChartUIProps()
        bindChartEvents()
        chartContainer.datum(data).call(chart)
        bindTooltip()
      } else {
        console.error("Grouped bar - Please provide valid name, value and group labels")
      }
    }
  })

  function bindTooltip() {
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltip.topicLabel("values")
    tooltip.shouldShowDateInTitle(false)
    tooltipContainer.datum([]).call(tooltip)
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
    if (notNull(tooltipTitle)) {
      tooltip.title(tooltipTitle)
    } else if (datasource.label) {
      tooltip.title(datasource.label)
    }
  }

  function bindChartEvents() {
    if (customClick) {
      chart.on("customClick", customClick)
    }
    chart.on("customMouseMove", tooltip.update)
    chart.on("customMouseOut", tooltip.hide)
    chart.on("customMouseOver", tooltip.show)
  }

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
