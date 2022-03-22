<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let title
  export let dataProvider
  export let labelColumn
  export let valueColumn
  export let height
  export let width
  export let dataLabels
  export let animate
  export let legend
  export let donut
  export let palette

  $: options = setUpChart(
    title,
    dataProvider,
    labelColumn,
    valueColumn,
    height,
    width,
    dataLabels,
    animate,
    legend,
    donut,
    palette
  )

  const setUpChart = (
    title,
    dataProvider,
    labelColumn,
    valueColumn,
    height,
    width,
    dataLabels,
    animate,
    legend,
    donut,
    palette
  ) => {
    if (
      !dataProvider ||
      !dataProvider.rows?.length ||
      !labelColumn ||
      !valueColumn
    ) {
      return null
    }

    // Fetch, filter and sort data
    const { schema, rows } = dataProvider
    const data = rows
      .filter(row => row[labelColumn] != null && row[valueColumn] != null)
      .slice(0, 100)
    if (!schema || !data.length) {
      return null
    }

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
      .palette(palette)

    // Add data if valid datasource
    const series = data.map(row => parseFloat(row[valueColumn]))
    const labels = data.map(row => row[labelColumn])
    builder = builder.series(series).labels(labels)

    // Build chart options
    return builder.getOptions()
  }
</script>

<ApexChart {options} />
