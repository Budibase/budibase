<script>
  import { getColorSchema, notNull } from "./utils.js"
  import Legend from "./Legend.svelte"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  const _id = shortid.generate()

  const chart = britecharts.donut()
  const chartClass = `donut-container-${_id}`
  const legendClass = `legend-container-${_id}`
  let legendChart

  let chartElement = null
  let chartContainer = null

  let chartSvgWidth = 0
  let chartSvg = null

  export let _bb
  export let model

  let store = _bb.store

  export let customMouseMove = null
  export let customClick = null

  export let orderingFunction = null

  export let data = model ? $store[model] : []
  export let color = "britecharts"
  export let height = 200
  export let width = 200
  export let margin = null

  export let centeredTextFunction = null
  export let externalRadius = 25
  export let percentageFormat = null
  export let hasFixedHighlightedSlice = false
  export let hasLastHoverSliceHighlighted = false
  export let hasHoverAnimation = true
  export let highlightSliceById = null
  export let numberFormat = null
  export let internalRadius = 25
  export let isAnimated = true
  export let radiusHoverOffset = 0
  export let useLegend = true
  export let horizontalLegend = false
  export let legendWidth = null
  export let legendHeight = null

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

  onMount(async () => {
    if (chart) {
      if (model) {
        await fetchData()
      }

      chart.emptyDataConfig({
        showEmptySlice: true,
        emptySliceColor: "#000000",
      })
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      chartContainer.datum(_data).call(chart)
    }
  })

  function bindChartUIProps() {
    chart.percentageFormat(".0f")

    if (notNull(color)) {
      chart.colorSchema(getColorSchema(color))
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
    if (notNull(centeredTextFunction)) {
      chart.centeredTextFunction(centeredTextFunction)
    }
    if (notNull(externalRadius)) {
      chart.externalRadius(externalRadius)
    }
    if (notNull(percentageFormat)) {
      chart.percentageFormat(percentageFormat)
    }
    if (notNull(hasFixedHighlightedSlice)) {
      chart.hasFixedHighlightedSlice(hasFixedHighlightedSlice)
    }
    if (notNull(hasLastHoverSliceHighlighted)) {
      chart.hasLastHoverSliceHighlighted(hasLastHoverSliceHighlighted)
    }
    if (notNull(hasHoverAnimation)) {
      chart.hasHoverAnimation(hasHoverAnimation)
    }
    if (notNull(highlightSliceById)) {
      chart.highlightSliceById(highlightSliceById)
    }
    if (notNull(numberFormat)) {
      chart.numberFormat(numberFormat)
    }
    if (notNull(internalRadius)) {
      chart.internalRadius(internalRadius)
    }
    if (notNull(isAnimated)) {
      chart.isAnimated(isAnimated)
    }
    if (notNull(radiusHoverOffset)) {
      chart.radiusHoverOffset(radiusHoverOffset)
    }
    if (notNull(orderingFunction)) {
      chart.orderingFunction(orderingFunction)
    }
    chartContainer.datum(_data).call(chart)
    chartSvg = document.querySelector(`.${chartClass} .britechart`)
  }

  function bindChartEvents() {
    if (customClick) {
      chart.on("customClick", customClick)
    }
    if (customMouseMove) {
      chart.on("customMouseMove", customMouseMove)
    }

    if (legendChart) {
      chart.on("customMouseOut", function() {
        legendChart.clearHighlight()
      })
      chart.on("customMouseOver", function(data) {
        legendChart.highlight(data.data.id)
      })
    }
  }

  $: if (!width && chartSvg) {
    width = chartSvg.clientWidth
    chart.width(width)
    chartContainer.datum(_data).call(chart)
  }

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
</script>

<div>
  <div bind:this={chartElement} class={chartClass} />
  {#if useLegend}
    <Legend
      bind:legend={legendChart}
      {colorSchema}
      useLegend
      isHorizontal={horizontalLegend}
      width={legendWidth || width}
      height={legendHeight}
      {chartClass}
      data={_data} />
  {/if}
</div>
