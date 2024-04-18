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
  export let valueUnits
  export let palette
  export let c1, c2, c3, c4, c5
  export let horizontal

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
  $: formatter = getFormatter(labelType, valueUnits)
  $: xAxisFormatter = getFormatter(labelType, valueUnits, horizontal, "x")
  $: yAxisFormatter = getFormatter(labelType, valueUnits, horizontal, "y")

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
    plotOptions: {
      bar: {
        horizontal
      }
    },
    // We can just always provide the categories to the xaxis and horizontal mode automatically handles "tranposing" the categories to the yaxis, but certain things like labels need to be manually put on a certain axis based on the selected mode. Titles do not need to be handled this way, they are exposed to the user as "X axis" and Y Axis" so flipping them would be confusing.
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
    // bar charts in horizontal mode don't have a default setting for parsing the labels of dates, and will just spit out the unix epoch value. It also doesn't seem to respect any date based formatting properties passed in. So we'll just manualy format the labels, the chart still sorts the dates correctly in any case
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

  const getFormatter = (labelType, valueUnits, horizontal, axis) => {
    const isLabelAxis = (axis === "y" && horizontal) || axis === "x" && !horizontal
    if (labelType === "datetime" && isLabelAxis) {
      return formatters["Datetime"]
    }

    return formatters[valueUnits]
  }

  $: console.log("opt", options);
</script>

<ApexChart {options} />
