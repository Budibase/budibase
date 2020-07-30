<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  const chart = britecharts.sparkline()
  const chartClass = `sparkline-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null

  export let data = []
  export let areaGradient = null
  export let height = null
  export let width = null
  export let dateLabel = null
  export let duration = null
  export let isAnimated = null
  export let lineGradient = null
  export let titleText = null
  export let titleTextStyle = null
  export let valueLabel = null
  export let useLegend = true

  onMount(() => {
    if (chart) {
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      chartContainer.datum(data).call(chart)
    }
  })

  function bindChartUIProps() {
    if (notNull(areaGradient)) {
      chart.areaGradient(aGradient)
    }
    if (notNull(lineGradient)) {
      chart.lineGradient(lGradient)
    }
    if (notNull(height)) {
      chart.height(height)
    }
    if (notNull(width)) {
      chart.width(width)
    }
    if (notNull(dateLabel)) {
      chart.dateLabel(dateLabel)
    }
    if (notNull(duration)) {
      chart.duration(duration)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(titleText)) {
      chart.titleText(titleText)
    }
    if (notNull(titleTextStyle)) {
      chart.titleTextStyle(titleTextStyle)
    }
    if (notNull(valueLabel)) {
      chart.valueLabel(valueLabel)
    }
  }

  $: aGradient = getChartGradient(areaGradient)
  $: lGradient = getChartGradient(lineGradient)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
