<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let title
  export let dataProvider
  export let labelColumn
  export let valueColumns
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
  $: series = getSeries(dataProvider, valueColumns)
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
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
    chart: {
      height: height == null || height === "" ? "auto" : height,
      width: width == null || width === "" ? "100%" : width,
      type: "radar",
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
        // Clicking a spoke
        click: function (event, chartContext, opts) {
          const dataPointIndex = opts.dataPointIndex
          const row = dataProvider.rows[dataPointIndex]

          console.log("Clicked!")
          console.log(event)
          console.log(chartContext)
          console.log(opts)
          console.log(row)
          // Prevents clicking on the chart but not a specific point from triggering actions
          if (dataPointIndex !== -1) {
            handleSpokeClick(row)
          }
        },
      },
      foreColor: "#808080", // Numbers/Scale up the spoke
    },
  }

  function handleSpokeClick(spoke) {
    onClick?.({ spoke })
  }

  const getSeries = (dataProvider, valueColumns) => {
    const rows = dataProvider.rows ?? []

    return valueColumns.map(column => {
      const data = rows.map(row => {
        const value = row?.[column]

        if (dataProvider?.schema?.[column]?.type === "datetime" && value) {
          return Date.parse(value)
        }

        const numValue = parseFloat(value)
        return isNaN(numValue) ? 0 : numValue
      })

      return {
        name: column,
        data,
      }
    })
  }

  const getLabels = (dataProvider, labelColumn, labelType) => {
    const rows = dataProvider.rows ?? []

    return rows.map(row => {
      const value = row?.[labelColumn]

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

<style>
  /*  data labels (at the end of each spoke) cannot be configured */
  :global(.apexcharts-datalabel) {
    fill: #ffffff !important;
  }
</style>
