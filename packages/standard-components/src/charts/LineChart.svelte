<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  // Common props
  export let title
  export let dataProvider
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
  export let legend
  export let yAxisUnits
  export let palette

  // Area specific props
  export let area
  export let stacked
  export let gradient

  $: options = setUpChart(dataProvider)

  // Fetch data on mount
  const setUpChart = provider => {
    const allCols = [labelColumn, ...(valueColumns || [null])]
    if (!provider || allCols.find(x => x == null)) {
      return null
    }

    // Fetch, filter and sort data
    const { schema, rows } = provider
    const reducer = row => (valid, column) => valid && row[column] != null
    const hasAllColumns = row => allCols.reduce(reducer(row), true)
    const data = rows.filter(row => hasAllColumns(row))
    if (!schema || !data.length) {
      return null
    }

    // Initialise default chart
    let builder = new ApexOptionsBuilder()
      .title(title)
      .type(area ? "area" : "line")
      .width(width)
      .height(height)
      .xLabel(xAxisLabel)
      .yLabel(yAxisLabel)
      .dataLabels(dataLabels)
      .animate(animate)
      .curve(curve.toLowerCase())
      .gradient(gradient)
      .stacked(stacked)
      .legend(legend)
      .yUnits(yAxisUnits)
      .palette(palette)

    // Add data
    let useDates = false
    if (schema[labelColumn]) {
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
    return builder.getOptions()
  }
</script>

<ApexChart {options} />
