<script>
  import { onMount } from "svelte"
  import FusionCharts from "fusioncharts"
  import Charts from "fusioncharts/fusioncharts.charts"
  import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion"
  import SvelteFC, { fcRoot } from "svelte-fusioncharts"

  fcRoot(FusionCharts, Charts, FusionTheme)

  export let _bb
  export let _instanceId
  export let model
  export let type = "column2d"

  let store = _bb.store

  $: chartConfigs = {
    type,
    width: "600",
    height: "400",
    dataFormat: "json",
    dataSource: {
      data: $store[model._id] || [],
    },
  }

  async function fetchData() {
    const FETCH_RECORDS_URL = `/api/${_instanceId}/all_${model._id}/records`
    const response = await _bb.api.get(FETCH_RECORDS_URL)
    if (response.status === 200) {
      const json = await response.json()
      store.update(state => {
        state[model._id] = json
        return state
      })
    } else {
      throw new Error("Failed to fetch records.", response)
    }
  }

  onMount(async () => {
    await fetchData()
  })
</script>

<div id="container">
  <SvelteFC {...chartConfigs} />
</div>
