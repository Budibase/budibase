<script>
  import { getContext, onMount } from "svelte"
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { isEmpty } from "lodash/fp"

  const { API } = getContext("app")
  const dataContext = getContext("data")

  export let title
  export let datasource
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
  export let styles

  let options

  // Fetch data on mount
  onMount(async () => {
    const allCols = [dateColumn, openColumn, highColumn, lowColumn, closeColumn]
    if (isEmpty(datasource) || allCols.find(x => x == null)) {
      options = false
      return
    }

    // Fetch, filter and sort data
    const schema = (await API.fetchTableDefinition(datasource.tableId)).schema
    const result = await API.fetchDatasource(datasource, $dataContext)
    const reducer = row => (valid, column) => valid && row[column] != null
    const hasAllColumns = row => allCols.reduce(reducer(row), true)
    const data = result
      .filter(row => hasAllColumns(row))
      .slice(0, 100)
      .sort((a, b) => (a[dateColumn] > b[dateColumn] ? 1 : -1))
    if (!schema || !data.length) {
      options = false
      return
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
    options = builder.getOptions()
  })
</script>

<ApexChart {options} {styles} />
