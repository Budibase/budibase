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
  export let dataLabels
  export let animate
  export let legend
  export let stacked
  export let yAxisUnits
  export let palette
  export let c1, c2, c3, c4, c5
  export let horizontal

  $: options = setUpChart(
    title,
    dataProvider,
    labelColumn,
    valueColumns,
    xAxisLabel,
    yAxisLabel,
    height,
    width,
    dataLabels,
    animate,
    legend,
    stacked,
    yAxisUnits,
    palette,
    horizontal,
    c1 && c2 && c3 && c4 && c5 ? [c1, c2, c3, c4, c5] : null,
    customColor
  )

  $: customColor = palette === "Custom"

  const setUpChart = (
    title,
    dataProvider,
    labelColumn,
    valueColumns,
    xAxisLabel,
    yAxisLabel,
    height,
    width,
    dataLabels,
    animate,
    legend,
    stacked,
    yAxisUnits,
    palette,
    horizontal,
    colors,
    customColor
  ) => {
    const allCols = [labelColumn, ...(valueColumns || [null])]
    if (
      !dataProvider ||
      !dataProvider.rows?.length ||
      allCols.find(x => x == null)
    ) {
      return null
    }

    // Fetch data
    const { schema, rows } = dataProvider
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
      .palette(palette)
      .horizontal(horizontal)
      .colors(customColor ? colors : null)

    // Add data
    let useDates = false
    if (schema[labelColumn]) {
      const labelFieldType = schema[labelColumn].type
      if (horizontal) {
        builder = builder.yType(labelFieldType).xUnits(yAxisUnits)
      } else {
        builder = builder.xType(labelFieldType).yUnits(yAxisUnits)
      }
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
      builder = builder.xCategories(data.map(row => row[labelColumn]))
    } else {
      // Horizontal dates don't work anyway, but this is the correct logic
      if (horizontal) {
        builder = builder.clearYFormatter()
      } else {
        builder = builder.clearXFormatter()
      }
    }

    // Build chart options
    return builder.getOptions()
  }
</script>

<ApexChart {options} />
