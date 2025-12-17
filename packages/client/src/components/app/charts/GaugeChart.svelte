<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let dataProvider
  export let labelColumn
  export let valueColumns
  export let autoMaxValue
  export let maxValue

  //   export let title
  export let palette
  export let c1, c2, c3, c4, c5
  export let animate
  export let startAngle
  export let endAngle

  $: series = getSeries(dataProvider, valueColumns, autoMaxValue, maxValue)
  $: categories = getCategories(dataProvider, labelColumn)

  $: options = {
    series,
    chart: {
      height: 350,
      type: "radialBar",
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
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 249 + " " + maxValue
            },
          },
        },
      },
    },
    labels: categories,
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    animations: {
      enabled: animate,
    },
  }

  const getSeries = (dataProvider, valueColumn, autoMaxValue, maxValue) => {
    console.log("getSeries is called!", maxValue)
    const rows = dataProvider.rows ?? []

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

      return numValue
    })

    // autoMaxValue - sets the highest value found to be a completed chart
    if (autoMaxValue) {
      const highestValuePassed = Math.max(...mappedValues)
      const autoMaxMappedValues = mappedValues.map(value => {
        return (value / highestValuePassed) * 100
      })
      return autoMaxMappedValues
    }

    // customMaxValue - sets the top of the chart to that value, represents all values as a percentage of that value
    console.log({ autoMaxValue }, Number(maxValue))
    if (!autoMaxValue && Number(maxValue)) {
      console.log("HEREREEREERERRRE")
      const customMaxMappedValues = mappedValues.map(value => {
        return (value / maxValue) * 100
      })
      console.log({ customMaxMappedValues })
      return customMaxMappedValues
    }
    return mappedValues
  }

  const getCategories = (dataProvider, labelColumn) => {
    const rows = dataProvider.rows ?? []

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
</script>

<ApexChart {options} />
