<script>
  import { getContext, onMount } from "svelte"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { isEmpty } from "lodash/fp"

  const { API } = getContext("sdk")

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
  export let palette

  let options

  // Fetch data on mount
  onMount(async () => {
    if (isEmpty(datasource) || !labelColumn || !valueColumn) {
      options = false
      return
    }

    // Fetch, filter and sort data
    const schema = (await API.fetchTableDefinition(datasource.tableId)).schema
    const result = await API.fetchDatasource(datasource)
    const data = result
      .filter(row => row[labelColumn] != null && row[valueColumn] != null)
      .slice(0, 20)
      .sort((a, b) => (a[labelColumn] > b[labelColumn] ? 1 : -1))
    if (!schema || !data.length) {
      options = false
      return
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
      .palette(palette)

    // Add data if valid datasource
    const series = data.map(row => parseFloat(row[valueColumn]))
    const labels = data.map(row => row[labelColumn])
    builder = builder.series(series).labels(labels)

    // Build chart options
    options = builder.getOptions()
  })
</script>

<ApexChart {options} />
