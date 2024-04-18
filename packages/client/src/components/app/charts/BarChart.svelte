<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { get } from "lodash";

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

  const formatters = {
    ["Default"]: val => val,
    ["Thousands"]: val => `${Math.round(val / 1000)}K`,
    ["Millions"]: val => `${Math.round(val / 1000000)}M`,
  }

  $: series = getSeries(dataProvider, valueColumns)
  $: categories = getCategories(dataProvider, labelColumn);

  $: dataType = dataProvider?.schema?.[labelColumn]?.type === 'datetime' ? 
    "datetime" : "category"

  $: options = {
    series,
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
      type: "bar",
      stacked,
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
      type: dataType,
      categories,
      title: {
        text: xAxisLabel
      }
    },
    yaxis: {
      title: {
        text: yAxisLabel
      },
      labels: {
        formatter: formatters[yAxisUnits]
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

  $: console.log("opt", options);
</script>

<ApexChart {options} />
