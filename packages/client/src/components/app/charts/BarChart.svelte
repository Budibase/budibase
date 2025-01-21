<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let dataProvider
  export let labelColumn
  export let valueColumns

  export let title
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

  $: series = getSeries(dataProvider, valueColumns)
  $: categories = getCategories(dataProvider, labelColumn)

  $: labelType =
    dataProvider?.schema?.[labelColumn]?.type === "datetime"
      ? "datetime"
      : "category"
  $: xAxisFormatter = getFormatter(labelType, yAxisUnits, horizontal, "x")
  $: yAxisFormatter = getFormatter(labelType, yAxisUnits, horizontal, "y")

  $: options = {
    series,
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: parsePalette(palette),
    },
    legend: {
      show: legend,
      position: "top",
      horizontalAlign: "right",
      showForSingleSeries: true,
      showForNullSeries: true,
      showForZeroSeries: true,
    },
    title: {
      text: title,
    },
    dataLabels: {
      enabled: dataLabels,
    },
    chart: {
      height: height == null || height === "" ? "auto" : height,
      width: width == null || width === "" ? "100%" : width,
      type: "bar",
      stacked,
      animations: {
        enabled: animate,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal,
      },
    },
    // We can just always provide the categories to the xaxis and horizontal mode automatically handles "tranposing" the categories to the yaxis, but certain things like labels need to be manually put on a certain axis based on the selected mode. Titles do not need to be handled this way, they are exposed to the user as "X axis" and Y Axis" so flipping them would be confusing.
    xaxis: {
      categories,
      labels: {
        formatter: xAxisFormatter,
      },
      title: {
        text: xAxisLabel,
      },
    },
    // Providing `type: "datetime"` normally makes Apex Charts parse unix time nicely with no additonal config, but bar charts in horizontal mode don't have a default setting for parsing the labels of dates, and will just spit out the unix time value. It also doesn't seem to respect any date based formatting properties passed in. So we'll just manually format the labels, the chart still sorts the dates correctly in any case
    yaxis: {
      labels: {
        formatter: yAxisFormatter,
      },
      title: {
        text: yAxisLabel,
      },
    },
  }

  const getSeries = (dataProvider, valueColumns = []) => {
    const rows = dataProvider.rows ?? []

    return valueColumns.map(column => ({
      name: column,
      data: rows.map(row => {
        const value = row?.[column]

        if (dataProvider?.schema?.[column]?.type === "datetime" && value) {
          return Date.parse(value)
        }

        return value
      }),
    }))
  }

  const getCategories = (dataProvider, labelColumn) => {
    const rows = dataProvider.rows ?? []

    return rows.map(row => {
      const value = row?.[labelColumn]

      // If a nullish or non-scalar type, replace it with an empty string
      if (!["string", "number", "boolean"].includes(typeof value)) {
        return ""
      }

      return value
    })
  }

  const getFormatter = (labelType, yAxisUnits, horizontal, axis) => {
    const isLabelAxis =
      (axis === "y" && horizontal) || (axis === "x" && !horizontal)
    if (labelType === "datetime" && isLabelAxis) {
      return formatters["Datetime"]
    }

    if (isLabelAxis) {
      return formatters["Default"]
    }

    return formatters[yAxisUnits]
  }
</script>

<ApexChart {options} />
