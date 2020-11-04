<script>
  import { onMount } from "svelte"
  import fetchData, { fetchSchema } from "../fetchData"
  import { sortBy } from "lodash/fp"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let _bb
  export let title
  export let datasource
  export let labelColumn
  export let valueColumn
  export let height
  export let width
  export let color
  export let dataLabels
  export let animate
  export let legend
  export let donut

  const store = _bb.store
  let options

  // Fetch data on mount
  onMount(async () => {
    if (!datasource || !labelColumn || !valueColumn) {
      return
    }

    const result = (await fetchData(datasource, $store)).slice(0, 20)
    const data = sortBy(row => row[labelColumn])(result)
    const schema = await fetchSchema(datasource.tableId)
    if (!schema || !data || !data.length) {
      return
    }

    // Check columns are valid
    if (datasource.type !== "view") {
      if (schema[labelColumn] == null) {
        return
      }
      if (schema[valueColumn] == null) {
        return
      }
    }

    // Initialise default chart
    let builder = new ApexOptionsBuilder()
      .title(title)
      .type(donut ? "donut" : "pie")
      .width(width)
      .height(height)
      .dataLabels(dataLabels)
      .animate(animate)
      .legend(legend)
      .legendPosition("right")

    // Add data if valid datasource
    const series = data.map(row => parseFloat(row[valueColumn]))
    builder = builder.series(series)
    if (data[0][labelColumn] != null) {
      builder = builder.labels(data.map(row => row[labelColumn]))
    }

    // Build chart options
    options = builder.getOptions()
  })
</script>

<ApexChart {options} />
