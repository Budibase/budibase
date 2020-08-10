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

  onMount(async () => {
    if (chart) {
      if (model) {
        await fetchData()
      }
      chartContainer = select(`.${chartClass}`)
      bindChartUIProps()
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

  $: _data = model ? $store[model] : data

  $: aGradient = getChartGradient(areaGradient)
  $: lGradient = getChartGradient(lineGradient)
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass} />
{/if}
