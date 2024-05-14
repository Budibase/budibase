<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters } from "./utils"

  export let title
  export let dataProvider
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

  $: series = getSeries(
    dataProvider,
    dateColumn,
    openColumn,
    highColumn,
    lowColumn,
    closeColumn
  )

  $: options = {
    series,
    title: {
      text: title,
    },
    chart: {
      height: height == null || height === "" ? "auto" : height,
      width: width == null || width === "" ? "100%" : width,
      type: "candlestick",
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
      tooltip: {
        formatter: formatters["Datetime"],
      },
      type: "datetime",
      title: {
        text: xAxisLabel,
      },
    },
    yaxis: {
      labels: {
        formatter: formatters[yAxisUnits],
      },
      title: {
        text: yAxisLabel,
      },
    },
  }

  const getValueAsUnixTime = (dataprovider, dateColumn, row) => {
    const value = row[dateColumn]

    if (dataProvider?.schema?.[dateColumn]?.type === "datetime") {
      return Date.parse(value)
    }

    if (typeof value === "number") {
      return value
    }

    const isString = typeof value === "string"
    // "2025" could be either an ISO 8601 datetime string or Unix time.
    // There's no way to tell the user's intent without providing more
    // granular controls.
    // We'll just assume any string without dashes is Unix time.

    if (isString && value.includes("-")) {
      const unixTime = Date.parse(value)

      if (isNaN(unixTime)) {
        return null
      }

      return unixTime
    }

    if (isString) {
      const unixTime = parseInt(value, 10)

      if (isNaN(unixTime)) {
        return null
      }

      return unixTime
    }

    return null
  }

  const getSeries = (
    dataProvider,
    dateColumn,
    openColumn,
    highColumn,
    lowColumn,
    closeColumn
  ) => {
    const rows = dataProvider.rows ?? []

    return [
      {
        data: rows.map(row => {
          const open = parseFloat(row[openColumn])
          const high = parseFloat(row[highColumn])
          const low = parseFloat(row[lowColumn])
          const close = parseFloat(row[closeColumn])

          return [
            getValueAsUnixTime(dataProvider, dateColumn, row),
            isNaN(open) ? 0 : open,
            isNaN(high) ? 0 : high,
            isNaN(low) ? 0 : low,
            isNaN(close) ? 0 : close,
          ]
        }),
      },
    ]
  }
</script>

<ApexChart {options} />
