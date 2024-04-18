<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { get } from "lodash";

  // Common props
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
  export let valueUnits
  export let palette
  export let c1, c2, c3, c4, c5

  const formatters = {
    ["Default"]: val => val,
    ["Thousands"]: val => `${Math.round(val / 1000)}K`,
    ["Millions"]: val => `${Math.round(val / 1000000)}M`,
    ["Datetime"]: val => (new Date(val)).toLocaleString()
  }

  $: series = getSeries(dataProvider, valueColumns)
  $: categories = getCategories(dataProvider, labelColumn);

  $: labelType = dataProvider?.schema?.[labelColumn]?.type === 'datetime' ? 
    "datetime" : "category"
  $: xAxisFormatter = getFormatter(labelType, valueUnits, "x")
  $: yAxisFormatter = getFormatter(labelType, valueUnits, "y")

  $: options = {
    series,
    stroke: {
      curve: curve.toLowerCase()
    },
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: palette === "Custom" ? null : palette
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
      enabled: dataLabels
    },
    chart: {
      height: height == null || height === "" ? "auto" : height,
      width: width == null || width === "" ? "100%" : width,
      type: "line",
      animations: {
        enabled: animate
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      type: labelType,
      categories,
      labels: {
        formatter: xAxisFormatter
      },
      title: {
        text: xAxisLabel
      }
    },
    yaxis: {
      labels: {
        formatter: yAxisFormatter
      },
      title: {
        text: yAxisLabel
      }
    }
  }

  const getSeries = (datasource, valueColumns = []) => {
    const rows = datasource.rows ?? [];

    return valueColumns.map(column => ({
      name: column,
      data: rows.map(row => {
        return row?.[column]
      }),
    }))
  }

  const getCategories = (datasource, labelColumn) => {
    const rows = datasource.rows ?? [];

    return rows.map(row => {
      const value = row?.[labelColumn]

      // If a nullish or non-scalar type, replace it with an empty string
      if (!["string", "number", "boolean"].includes(typeof value)) {
        return ""
      }

      return value;
    })
  }

  const getFormatter = (labelType, valueUnits, axis) => {
    const isLabelAxis = axis === "x"

    if (labelType === "datetime" && isLabelAxis) {
      return formatters["Datetime"]
    }

    if (isLabelAxis) {
      return formatters["Default"]
    }

    return formatters[valueUnits]
  }

  $: console.log("opt", options);
</script>

<ApexChart {options} />
