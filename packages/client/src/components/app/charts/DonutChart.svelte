<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let title
  export let dataProvider
  export let labelColumn
  export let valueColumn
  export let height
  export let width
  export let animate
  export let dataLabels
  export let legend
  export let palette
  export let c1, c2, c3, c4, c5

  $: labelType =
    dataProvider?.schema?.[labelColumn]?.type === "datetime"
      ? "datetime"
      : "category"
  $: series = getSeries(dataProvider, valueColumn)
  $: labels = getLabels(dataProvider, labelColumn, labelType)

  $: options = {
    series,
    labels,
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: parsePalette(palette),
    },
    legend: {
      show: legend,
      position: "right",
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
      type: "donut",
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
  }

  const getSeries = (dataProvider, valueColumn) => {
    const rows = dataProvider.rows ?? []

    return rows.map(row => {
      const value = row?.[valueColumn]

      if (dataProvider?.schema?.[valueColumn]?.type === "datetime" && value) {
        return Date.parse(value)
      }

      // This chart doesn't automatically parse strings into numbers
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        return 0
      }

      return numValue
    })
  }

  const getLabels = (dataProvider, labelColumn, labelType) => {
    const rows = dataProvider.rows ?? []

    return rows.map(row => {
      const value = row?.[labelColumn]

      // If a nullish or non-scalar type, replace it with an empty string
      if (!["string", "number", "boolean"].includes(typeof value)) {
        return ""
      } else if (labelType === "datetime") {
        return formatters["Datetime"](value)
      }

      return value
    })
  }
</script>

<ApexChart {options} />
