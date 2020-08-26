<script>
  import { getColorSchema, notNull } from "./utils.js"
  import fetchData from "../fetchData.js"
  import Legend from "./Legend.svelte"
  import britecharts from "britecharts"
  import { onMount } from "svelte"
  import { isEmpty } from "lodash/fp"

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

  let store = _bb.store

  export let customMouseMove = null
  export let customClick = null

  export let orderingFunction = null

  let data = []
  export let datasource = {}

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
  export let nameKey = null
  export let valueKey = null
  // export let useLegend = true
  export let horizontalLegend = false
  export let legendWidth = null
  export let legendHeight = null

  onMount(async () => {
    if (chart) {
      if (!isEmpty(datasource)) {
        let _data = await fetchData(datasource)
        data = checkAndReformatData(_data)
        if (data.length === 0) {
          console.error(
            "Donut - please provide a valid name and value field for the chart"
          )
        }
      }

      chart.emptyDataConfig({
        showEmptySlice: true,
        emptySliceColor: "#F0F0F0",
      })

      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      chartContainer.datum(data).call(chart)
    }
  })

  function checkAndReformatData(data) {
    let _data = [...data]

    if (valueKey && valueKey !== "quantity") {
      _data = reformatDataKey(_data, valueKey, "quantity")
    }

    if (nameKey && nameKey !== "name") {
      _data = reformatDataKey(_data, nameKey, "name")
    }

    return _data.every(d => d.quantity) && _data.every(d => d.name) ? _data : []
  }

  function reformatDataKey(data = [], dataKey = null, formatKey = null) {
    let ignoreList = ["_id", "_rev", "id"]
    if (dataKey && data.every(d => d[dataKey])) {
      return data.map(d => {
        let clonedRecord = { ...d }
        if (clonedRecord[formatKey]) {
          delete clonedRecord[formatKey]
        }
        let value = clonedRecord[dataKey]
        if (!ignoreList.includes(dataKey)) {
          delete clonedRecord[dataKey]
        }
        clonedRecord[formatKey] = value
        return clonedRecord
      })
    } else {
      return data
    }
  }

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
    chartContainer.datum(data).call(chart)
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
    chartContainer.datum(data).call(chart)
  }

  $: colorSchema = getColorSchema(color)
</script>

<div>
  <div bind:this={chartElement} class={chartClass} />
  {#if data.length > 0}
    <Legend
      bind:legend={legendChart}
      {colorSchema}
      useLegend
      isHorizontal={horizontalLegend}
      width={legendWidth || width}
      height={legendHeight}
      {chartClass}
      {data} />
  {/if}
</div>
