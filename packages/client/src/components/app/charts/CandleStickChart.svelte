<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let title
  export let dataProvider
  export let dateColumn
  export let openColumn
  export let highColumn
  export let lowColumn
  export let closeColumn
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let animate
  export let yAxisUnits

  $: options = setUpChart(
    title,
    dataProvider,
    dateColumn,
    openColumn,
    highColumn,
    lowColumn,
    closeColumn,
    xAxisLabel,
    yAxisLabel,
    height,
    width,
    animate,
    yAxisUnits
  )

  const setUpChart = (
    title,
    dataProvider,
    dateColumn,
    openColumn,
    highColumn,
    lowColumn,
    closeColumn,
    xAxisLabel,
    yAxisLabel,
    height,
    width,
    animate,
    yAxisUnits
  ) => {
    const allCols = [dateColumn, openColumn, highColumn, lowColumn, closeColumn]
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
    const data = rows.filter(row => hasAllColumns(row))
    if (!schema || !data.length) {
      return null
    }

    // Initialise default chart
    let builder = new ApexOptionsBuilder()
      .type("candlestick")
      .title(title)
      .width(width)
      .height(height)
      .xLabel(xAxisLabel)
      .yLabel(yAxisLabel)
      .animate(animate)
      .yUnits(yAxisUnits)
      .yTooltip(true)
      .xType("datetime")

    // Add data
    const parseDate = d => (isNaN(d) ? Date.parse(d).valueOf() : parseInt(d))
    const chartData = data.map(row => ({
      x: parseDate(row[dateColumn]),
      y: [row[openColumn], row[highColumn], row[lowColumn], row[closeColumn]],
    }))
    builder = builder.series([{ data: chartData }])

    // Build chart options
    return builder.getOptions()
  }
</script>

<ApexChart {options} />
