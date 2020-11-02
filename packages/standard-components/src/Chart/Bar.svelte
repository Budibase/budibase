<script>
  import { onMount } from "svelte"
  import { chart } from "svelte-apexcharts"
  import fetchData from "../fetchData"
  import { isEmpty } from "lodash/fp"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"

  export let datasource
  export let nameLabel
  export let valueLabel
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let color
  export let horizontal
  export let dataLabels
  export let animate

  let data
  $: options = getChartOptions(data)

  // Fetch data on mount
  onMount(async () => {
    if (!isEmpty(datasource)) {
      data = await fetchData(datasource)
    }
  })

  function getChartOptions(rows = []) {
    // Initialise default chart
    let builder = new ApexOptionsBuilder()
      .type("bar")
      .color(color)
      .width(width)
      .height(height)
      .xLabel(xAxisLabel)
      .yLabel(yAxisLabel)
      .horizontal(horizontal)
      .dataLabels(dataLabels)
      .animate(animate)

    // Add data if valid datasource
    if (rows && rows.length) {
      rows = rows.slice(0, 50)
      if (!isEmpty(nameLabel) && !isNaN(rows[0][valueLabel])) {
        builder = builder.series([
          {
            name: valueLabel,
            data: rows.map(row => row[valueLabel]),
          },
        ])
      }
      if (!isEmpty(nameLabel)) {
        builder = builder.categories(rows.map(row => row[nameLabel]))
      }
    }

    // Build chart options
    return builder.getOptions()
  }
</script>

<div use:chart={options} />
