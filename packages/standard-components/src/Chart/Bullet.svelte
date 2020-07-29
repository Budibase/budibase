<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  const chart = britecharts.bullet()
  const chartClass = `bullet-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null

  export let data = []
  export let aspectRatio = null
  export let color = "britecharts"
  export let customSubtitle = null
  export let customTitle = null
  export let numberFormat = null
  export let paddingBetweenAxisAndChart = null
  export let startMaxRangeOpacity = null
  export let ticks = null
  export let isReverse = false
  export let height = 200
  export let width = 200
  export let margin = { top: 0, right: 0, bottom: 0, left: 0 }

  onMount(() => {
    if (chart) {
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      chartContainer.datum(data).call(chart)
    }
  })

  function bindChartUIProps() {
    if (notNull(color)) {
      chart.colorSchema(colorSchema)
    }
    if (notNull(aspectRatio)) {
      chart.aspectRatio(aspectRatio)
    }
    if (notNull(customSubtitle)) {
      chart.customSubtitle(customSubtitle)
    }
    if (notNull(customTitle)) {
      chart.customTitle(customTitle)
    }
    if (notNull(numberFormat)) {
      chart.numberFormat(numberFormat)
    }
    if (notNull(paddingBetweenAxisAndChart)) {
      chart.paddingBetweenAxisAndChart(paddingBetweenAxisAndChart)
    }
    if (notNull(startMaxRangeOpacity)) {
      chart.startMaxRangeOpacity(startMaxRangeOpacity)
    }
    if (notNull(ticks)) {
      chart.ticks(ticks)
    }
    if (notNull(isReverse)) {
      chart.isReverse(isReverse)
    }
    if (notNull(height)) {
      chart.height(height)
    }
    if (notNull(width)) {
      chart.width(width)
    }
  }

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
