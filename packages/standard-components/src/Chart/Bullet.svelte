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

  $: _data = model ? $store[model] : data

  $: colorSchema = getColorSchema(color)
</script>

<div bind:this={chartElement} class={chartClass} />
