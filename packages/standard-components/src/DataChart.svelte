<script>
  import { onMount } from "svelte"
  import FusionCharts from "fusioncharts"
  import Charts from "fusioncharts/fusioncharts.charts"
  import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion"
  import SvelteFC, { fcRoot } from "svelte-fusioncharts"

  fcRoot(FusionCharts, Charts, FusionTheme)

  export let _bb
  export let table
  export let type = "column2d"

  let store = _bb.store

  $: chartConfigs = {
    type,
    width: "600",
    height: "400",
    dataFormat: "json",
    dataSource: {
      data: $store[table] || [],
    },
  }

  $: console.log("CHART CONFIGS", chartConfigs)

  async function fetchData() {
    const FETCH_ROWS_URL = `/api/views/all_${table}`
    const response = await _bb.api.get(FETCH_ROWS_URL)
    if (response.status === 200) {
      const json = await response.json()
      store.update(state => {
        state[table] = json
        return state
      })
    } else {
      throw new Error("Failed to fetch rows.", response)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<div id="container">
  <SvelteFC {...chartConfigs} />
</div>
