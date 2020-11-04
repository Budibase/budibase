<script>
  import { onMount } from "svelte"
  import fetchData, { fetchSchema } from "../fetchData"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let _bb
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

  const store = _bb.store
  let options

  // Fetch data on mount
  onMount(async () => {
    if (!datasource || !labelColumn || !valueColumns || !valueColumns.length) {
      options = false
      return
    }

    // Fetch, filter and sort data
    const schema = await fetchSchema(datasource.tableId)
    const result = await fetchData(datasource, $store)
    const reducer = row => (valid, column) => valid && row[column] != null
    const hasAllValues = row => valueColumns.reduce(reducer(row), true)
    const data = result
      .filter(row => row[labelColumn] != null && hasAllValues(row))
      .slice(0, 20)
      .sort((a, b) => (a[labelColumn] > b[labelColumn] ? 1 : -1))
    if (!schema || !data.length) {
      options = false
      return
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
    if (!useDates) {
      builder = builder.categories(data.map(row => row[labelColumn]))
    }

    // Build chart options
    options = builder.getOptions()
  })
</script>

<ApexChart {options} />
