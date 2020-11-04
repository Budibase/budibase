<script>
  import { onMount } from "svelte"
  import fetchData, { fetchSchema } from "../fetchData"
  import { sortBy } from "lodash/fp"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let title
  export let datasource
  export let labelColumn
  export let valueColumns
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let color
  export let dataLabels
  export let animate
  export let legend
  export let stacked
  export let yAxisUnits

  let options

  // Fetch data on mount
  onMount(async () => {
    if (!datasource || !labelColumn || !valueColumns || !valueColumns.length) {
      return
    }

    const result = (await fetchData(datasource)).slice(0, 20)
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
      for (let i = 0; i < valueColumns.length; i++) {
        if (schema[valueColumns[i]] == null) {
          return
        }
      }
    }

    // Initialise default chart
    let builder = new ApexOptionsBuilder()
      .type("bar")
      .title(title)
      .width(width)
      .height(height)
      .xLabel(xAxisLabel)
      .yLabel(yAxisLabel)
      .dataLabels(dataLabels)
      .animate(animate)
      .legend(legend)
      .stacked(stacked)
      .yUnits(yAxisUnits)

    // Add data
    let useDates = false
    if (datasource.type !== "view" && schema[labelColumn]) {
      const labelFieldType = schema[labelColumn].type
      builder = builder.xType(labelFieldType)
      useDates = labelFieldType === "datetime"
    }
    const series = valueColumns.map(column => ({
      name: column,
      data: data.map(row => {
        if (!useDates) {
          return row[column]
        } else {
          return [row[labelColumn], row[column]]
        }
      }),
    }))
    builder = builder.series(series)
    if (!useDates && data[0][labelColumn] != null) {
      builder = builder.categories(data.map(row => row[labelColumn]))
    }

    // Build chart options
    options = builder.getOptions()
  })

  $: console.log(options)
</script>

<ApexChart {options} />
