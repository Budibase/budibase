<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { get } from "lodash";

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

    const data = rows.slice(0, 100)
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
    if (schema[labelColumn]) {
      const labelFieldType = schema[labelColumn].type
      if (horizontal) {
        builder = builder.xUnits(yAxisUnits)
      } else {
        builder = builder.yUnits(yAxisUnits)
      }
    }
    const series = (valueColumns ?? []).map(column => ({
      name: column,
      data: data.map(row => {
        const value = get(row, column);

        if (schema?.[column]?.type === 'datetime') {
          return Date.parse(value)
        }

        if (Array.isArray(value)) {
          return null;
        }

        if (Number.isNaN(parseInt(value, 10))) {
          return null;
        }

        return value;
      }),
    }))
    builder = builder.series(series)
    builder = builder.xCategories(data.map(row => {
      const value = row[labelColumn]
      if (schema[labelColumn]?.type === 'datetime') {
        const dateString = (new Date(Date.parse(value))).toLocaleDateString()
        console.log(value)
        console.log(dateString)
        console.log()
        return dateString
      }

      return value ?? ""
    }))

    // Build chart options
    return builder.getOptions()
  }
</script>

<ApexChart {options} />
