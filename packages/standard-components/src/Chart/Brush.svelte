<script>
  import { getColorSchema, getChartGradient, notNull } from "./utils"
  import britecharts from "britecharts"
  import { onMount } from "svelte"

  import { select } from "d3-selection"
  import shortid from "shortid"

  /* 
    ISSUES
    - Chart gradient doesn't seem to do anything
  */

  export let _bb
  export let model

  let store = _bb.store

  const _id = shortid.generate()

  const chart = britecharts.brush()
  const chartClass = `brush-container-${_id}`
  const legendClass = `legend-container-${_id}`

  let chartElement = null
  let chartContainer = null

  export let customBrushEnd = null
  export let customBrushStart = null

  export let data = []
  export let gradient = null
  export let height = 200
  export let width = 200
  export let margin = { top: 0, right: 0, bottom: 0, left: 0 }

  export let dateRange = null
  export let locale = null
  export let roundingTimeInterval = null
  export let xAxisFormat = null
  export let xTicks = null
  export let xAxisCustomFormat = null

  onMount(async () => {
    if (chart) {
      if (model) {
        await fetchData()
      }
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
      bindChartEvents()
      chartContainer.datum(_data).call(chart)
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
    if (notNull(gradient)) {
      chart.gradient(chartGradient)
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
    if (notNull(dateRange)) {
      chart.dateRange(dateRange)
    }
    if (notNull(locale)) {
      chart.locale(locale)
    }
    if (notNull(roundingTimeInterval)) {
      chart.roundingTimeInterval(roundingTimeInterval)
    }
    if (notNull(xAxisFormat)) {
      chart.xAxisFormat(xAxisFormat)
    }
    if (notNull(xTicks)) {
      chart.xTicks(xTicks)
    }
    if (notNull(xAxisCustomFormat)) {
      chart.xAxisCustomFormat(xAxisCustomFormat)
    }
  }

  function bindChartEvents() {
    if (customBrushEnd) {
      chart.on("customBrushEnd", customBrushEnd)
    }
    if (customBrushStart) {
      chart.on("customBrushStart", customBrushStart)
    }
  }

  $: _data = model ? $store[model] : data

  $: chartGradient = getChartGradient(gradient)
  $: console.log(chartGradient)
</script>

<div bind:this={chartElement} class={chartClass} />
