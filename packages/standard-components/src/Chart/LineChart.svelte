<script>
  import { onMount } from "svelte"
  import { chart } from "svelte-apexcharts"
  import fetchData from "../fetchData"
  import { isEmpty, sortBy } from "lodash/fp"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"

  export let title
  export let datasource
  export let labelColumn
  export let valueColumns
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let color
  export let animate
  export let dataLabels
  export let curve
  export let fill
  export let legend

  let data = []
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
      .type(fill ? "area" : "line")
      // .color(color)
      .width(width)
      .height(height)
      .xLabel(xAxisLabel)
      .yLabel(yAxisLabel)
      .dataLabels(dataLabels)
      .animate(animate)
      .curve(curve.toLowerCase())
      .gradient(fill)
      .legend(legend)

    // Add data if valid datasource
    if (rows && rows.length) {
      if (valueColumns && valueColumns.length) {
        const series = valueColumns.map(column => ({
          name: column,
          data: rows.map(row => parseFloat(row[column])),
        }))
        builder = builder.series(series)
      }
      if (!isEmpty(rows[0][labelColumn])) {
        builder = builder.categories(rows.map(row => row[labelColumn]))
      }
    }

    // Build chart options
    return builder.getOptions()
  }

  $: console.log(options)
</script>

<div use:chart={options} />
