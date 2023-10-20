<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"

  export let title
  export let dataProvider
  export let valueColumn
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let dataLabels
  export let animate
  export let palette
  export let c1, c2, c3, c4, c5
  export let horizontal
  export let bucketCount = 10

  $: options = setUpChart(
    title,
    dataProvider,
    valueColumn,
    xAxisLabel || valueColumn,
    yAxisLabel,
    height,
    width,
    dataLabels,
    animate,
    palette,
    horizontal,
    c1 && c2 && c3 && c4 && c5 ? [c1, c2, c3, c4, c5] : null,
    customColor,
    bucketCount
  )

  $: customColor = palette === "Custom"

  const setUpChart = (
    title,
    dataProvider,
    valueColumn,
    xAxisLabel, //freqAxisLabel
    yAxisLabel, //valueAxisLabel
    height,
    width,
    dataLabels,
    animate,
    palette,
    horizontal,
    colors,
    customColor,
    bucketCount
  ) => {
    const allCols = [valueColumn]
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
      .xLabel(horizontal ? yAxisLabel : xAxisLabel)
      .yLabel(horizontal ? xAxisLabel : yAxisLabel)
      .dataLabels(dataLabels)
      .animate(animate)
      .palette(palette)
      .horizontal(horizontal)
      .colors(customColor ? colors : null)

    if (horizontal) {
      builder = builder.setOption(["plotOptions", "bar", "barHeight"], "90%")
    } else {
      builder = builder.setOption(["plotOptions", "bar", "columnWidth"], "99%")
    }

    // Pull occurences of the value.
    let flatlist = data.map(row => {
      return row[valueColumn]
    })

    // Build range buckets
    let interval = Math.max(...flatlist) / bucketCount
    let counts = Array(bucketCount).fill(0)

    // Assign row data to a bucket
    let buckets = flatlist.reduce((acc, val) => {
      let dest = Math.min(Math.floor(val / interval), bucketCount - 1)
      acc[dest] = acc[dest] + 1
      return acc
    }, counts)

    const rangeLabel = bucketIdx => {
      return `${Math.floor(interval * bucketIdx)} - ${Math.floor(
        interval * (bucketIdx + 1)
      )}`
    }

    const series = [
      {
        name: yAxisLabel,
        data: Array.from({ length: buckets.length }, (_, i) => ({
          x: rangeLabel(i),
          y: buckets[i],
        })),
      },
    ]

    builder = builder.setOption(["xaxis", "labels"], {
      formatter: x => {
        return x + ""
      },
    })

    builder = builder.series(series)

    return builder.getOptions()
  }
</script>

<ApexChart {options} />
