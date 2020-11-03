<script>
  import { onMount } from "svelte"
  import { chart } from "svelte-apexcharts"
  import fetchData from "../fetchData"
  import { isEmpty, sortBy } from "lodash/fp"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"

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

  let data
  $: options = getChartOptions(data)

  // Fetch data on mount
  onMount(async () => {
    if (!isEmpty(datasource)) {
      const result = (await fetchData(datasource)).slice(0, 20)
      data = sortBy(row => row[labelColumn])(result)
    }
  })

  function getChartOptions(rows = []) {
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
    if (rows && rows.length) {
      if (!isEmpty(valueColumn) && rows[0][valueColumn] != null) {
        const series = rows.map(row => parseFloat(row[valueColumn]))
        builder = builder.series(series)
      }
      if (!isEmpty(rows[0][labelColumn])) {
        builder = builder.labels(rows.map(row => row[labelColumn]))
      }
    }

    // Build chart options
    return builder.getOptions()
  }
</script>

<div use:chart={options} />
