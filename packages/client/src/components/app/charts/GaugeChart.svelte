<script>
  import ApexChart from "./ApexChart.svelte"
  import { parsePalette } from "./utils"

  export let dataProvider
  export let labelColumn
  export let valueColumn
  export let autoMaxValue
  export let maxValue
  export let onClick

  export let title
  export let palette
  export let c1, c2, c3, c4, c5
  export let animate
  export let startAngle
  export let endAngle
  export let showTrack
  export let lineCap
  export let dataLabels
  export let offsetX
  export let offsetY
  export let textSize
  export let showImage
  export let imageURL
  export let imageWidth
  export let imageHeight
  export let height
  export let width
  export let titleSize
  export let showPercentage

  const formatPercentage = value => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) {
      return ""
    }
    return `${numericValue.toFixed(2)}%`
  }

  const showSingleValuePercentage = (w, hoveredValue) => {
    if (!showPercentage) {
      return
    }
    const hasSingleSeries =
      Array.isArray(w?.config?.series) && w.config.series.length === 1
    if (!hasSingleSeries) {
      return
    }
    const group = w?.globals?.dom?.baseEl?.querySelector(
      ".apexcharts-datalabels-group"
    )
    if (!group) {
      return
    }
    const valueElement = group.querySelector(".apexcharts-datalabel-value")
    if (!valueElement) {
      return
    }
    valueElement.textContent =
      hoveredValue == null ? "" : formatPercentage(hoveredValue)
  }

  $: series = getSeries(dataProvider, valueColumn, autoMaxValue, maxValue)
  $: categories = getCategories(dataProvider, labelColumn)

  $: options = {
    series,
    chart: {
      height: Number(height),
      width,
      type: "radialBar",
      animations: {
        enabled: animate ?? true,
        animateGradually: { enabled: animate ?? true },
        dynamicAnimation: { enabled: animate ?? true },
      },
      events: {
        dataPointSelection: function (event, chartContext, opts) {
          const index = opts?.dataPointIndex
          const line = dataProvider?.rows?.[index]
          handleLineClick(line, index)
        },
        dataPointMouseEnter: function (event, chartContext, opts) {
          const w = opts?.w
          const seriesIndex = opts?.seriesIndex
          const hoveredValue = w?.config?.series?.[seriesIndex]
          showSingleValuePercentage(w, hoveredValue)
        },
        dataPointMouseLeave: function (event, chartContext, opts) {
          showSingleValuePercentage(opts?.w, null)
        },
      },
    },
    plotOptions: {
      radialBar: {
        startAngle,
        endAngle,
        dataLabels: {
          name: {
            show: true,
            fontSize: "22px",
          },
          value: {
            show: showPercentage,
            fontSize: "16px",
            formatter: function (val) {
              return formatPercentage(val)
            },
            color: "var(--spectrum-global-color-gray-600)",
          },
          total: {
            show: true,
            label: title,
            // Nothingburger function to override default behaviour
            formatter: function () {
              return
            },
            fontSize: `${titleSize}px`,
            color: "var(--spectrum-global-color-gray-600)",
          },
        },
        barLabels: {
          enabled: dataLabels,
          useSeriesColors: true,
          offsetX,
          offsetY,
          fontSize: `${textSize}px`,
        },
        track: {
          show: showTrack,
          strokeWidth: "25%",
          background: "#808080",
          opacity: 0.5,
        },
        hollow: {
          margin: 15,
          image: showImage ? imageURL : "",
          imageClipped: false,
          imageWidth,
          imageHeight,
          position: "back",
        },
      },
    },
    labels: categories,
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: parsePalette(palette),
    },
    stroke: {
      lineCap: lineCap,
    },
  }

  const getSeries = (dataProvider, valueColumn, autoMaxValue, maxValue) => {
    const rows = dataProvider?.rows ?? []

    const mappedValues = rows.map(row => {
      const value = row?.[valueColumn]

      if (dataProvider?.schema?.[valueColumn]?.type === "datetime" && value) {
        return Date.parse(value)
      }

      // This chart doesn't automatically parse strings into numbers
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        return 0
      }

      if (numValue <= 0) {
        return 0
      }

      return numValue
    })

    // autoMaxValue - sets the highest value found to be a completed chart
    if (autoMaxValue) {
      let highestValuePassed = Math.max(...mappedValues)
      highestValuePassed <= 0 ? (highestValuePassed = 1) : ""
      const autoMaxMappedValues = mappedValues.map(value => {
        return (value / highestValuePassed) * 100
      })
      return autoMaxMappedValues
    }

    // customMaxValue - sets the top of the chart to that value, represents all values as a percentage of that value
    if (!autoMaxValue && Number(maxValue)) {
      const customMaxMappedValues = mappedValues.map(value => {
        return (value / maxValue) * 100
      })
      return customMaxMappedValues
    }
    return mappedValues
  }

  const getCategories = (dataProvider, labelColumn) => {
    const rows = dataProvider?.rows ?? []

    const returnValue = rows.map(row => {
      const value = row?.[labelColumn]

      // If a nullish or non-scalar type, replace it with an empty string
      if (!["string", "number", "boolean"].includes(typeof value)) {
        return ""
      }

      return value
    })

    return returnValue
  }

  function handleLineClick(line, index) {
    onClick?.({ line, index })
  }
</script>

<ApexChart {options} />

<style>
</style>
