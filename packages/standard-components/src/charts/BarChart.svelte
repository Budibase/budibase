<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let title
  export let dataProvider
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
  export let palette

  $: options = setUpChart(dataProvider)

  const setUpChart = provider => {
    const allCols = [labelColumn, ...(valueColumns || [null])]
    if (!provider || allCols.find(x => x == null)) {
      return null
    }

    // Fatch data
    const { schema, rows } = provider
    const reducer = row => (valid, column) => valid && row[column] != null
    const hasAllColumns = row => allCols.reduce(reducer(row), true)
    const data = rows.filter(row => hasAllColumns(row)).slice(0, 100)
    if (!schema || !data.length) {
      return null
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
