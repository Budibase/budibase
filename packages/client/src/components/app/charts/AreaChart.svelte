<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let title
  export let dataProvider
  export let labelColumn
  export let valueColumns
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let animate
  export let dataLabels
  export let curve
  export let legend
  export let yAxisUnits
  export let palette
  export let c1, c2, c3, c4, c5

  export let stacked
  export let gradient

  $: series = getSeries(dataProvider, valueColumns)
  $: categories = getCategories(dataProvider, labelColumn)

  $: labelType =
    dataProvider?.schema?.[labelColumn]?.type === "datetime"
      ? "datetime"
      : "category"
  $: xAxisFormatter = getFormatter(labelType, yAxisUnits, "x")
  $: yAxisFormatter = getFormatter(labelType, yAxisUnits, "y")
  $: fill = getFill(gradient)

  $: options = {
    series,
    stroke: {
      curve: curve.toLowerCase(),
    },
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: parsePalette(palette),
    },
    fill,
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
      type: "area",
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
    xaxis: {
      categories,
      labels: {
        formatter: xAxisFormatter,
      },
      title: {
        text: xAxisLabel,
      },
    },
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

  const getFormatter = (labelType, yAxisUnits, axis) => {
    const isLabelAxis = axis === "x"

    if (labelType === "datetime" && isLabelAxis) {
      return formatters["Datetime"]
    }

    if (isLabelAxis) {
      return formatters["Default"]
    }

    return formatters[yAxisUnits]
  }

  const getFill = gradient => {
    if (gradient) {
      return {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      }
    }

    return { type: "solid" }
  }
</script>

<ApexChart {options} />
