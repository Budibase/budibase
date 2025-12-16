<script>
  import ApexChart from "./ApexChart.svelte"
  import { formatters, parsePalette } from "./utils"

  export let dataProvider
  export let labelColumn
  export let valueColumns

  console.log(Array.isArray(valueColumns))
  //   export let title
  //   export let palette
  //   export let c1, c2, c3, c4, c5

  $: series = getSeries(dataProvider, valueColumns)
  $: categories = getCategories(dataProvider, labelColumn)

  $: options = {
    series: series || [10, 10, 8],
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
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
              return 249
            },
          },
        },
      },
    },
    labels: categories,
  }

  // Coppied this from BarChart.Svelte - seems to be causing issues here, will rectify in the morning.
  const getSeries = (dataProvider, valueColumns = []) => {
    const rows = dataProvider.rows ?? []

    return valueColumns.map(column => ({
      name: column,
      data: rows.map(row => {
        const value = row?.[column]
        console.log("54")
        if (dataProvider?.schema?.[column]?.type === "datetime" && value) {
          console.log("THIS WAS TRYE")
          return Date.parse(value)
        }

        return value
      }),
    }))
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

    console.log(returnValue)
    return returnValue
  }
</script>

<ApexChart {options} />
