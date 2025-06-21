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
  export let onClick

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
      events: {
        // Clicking on a slice of the donut
        dataPointSelection: function (event, chartContext, opts) {
          const segmentIndex = opts.dataPointIndex
          const row = dataProvider.rows[segmentIndex]

          // Percentage calculation:
          // get value column from all rows
          const rowValues = dataProvider.rows.map(row => {
            return row[valueColumn]
          })

          // get total of all value columns
          const initialValue = 0
          const total = rowValues.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
          )

          const percentage = ((row[valueColumn] / total) * 100).toFixed(1)

          handleSegmentClick(row, segmentIndex + 1, percentage)
        },
      },
    },
  }

  function handleSegmentClick(segment, index, percentage) {
    onClick?.({ segment, index, percentage })
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
