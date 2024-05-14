<script>
  import ApexChart from "./ApexChart.svelte"
  import { parsePalette } from "./utils"

  export let dataProvider
  export let valueColumn
  export let title
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let dataLabels
  export let animate
  export let stacked
  export let palette
  export let c1, c2, c3, c4, c5
  export let horizontal
  export let bucketCount = 10

  $: series = getSeries(dataProvider, valueColumn, bucketCount)

  $: xAxisFormatter = getFormatter(horizontal, "x")
  $: yAxisFormatter = getFormatter(horizontal, "y")

  $: options = {
    series,
    colors: palette === "Custom" ? [c1, c2, c3, c4, c5] : [],
    theme: {
      palette: parsePalette(palette),
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
      type: "bar",
      stacked,
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
    plotOptions: {
      bar: {
        horizontal,
      },
    },
    xaxis: {
      type: "category",
      title: {
        text: xAxisLabel,
      },
      labels: {
        formatter: xAxisFormatter,
      },
    },
    yaxis: {
      decimalsInFloat: 0,
      title: {
        text: yAxisLabel,
      },
      labels: {
        formatter: yAxisFormatter,
      },
    },
  }

  const getSeries = (dataProvider, valueColumn, bucketCount) => {
    const rows = dataProvider.rows ?? []

    const values = rows
      .map(row => parseFloat(row[valueColumn]))
      .filter(value => !isNaN(value))
    const [min, max] = getValuesRange(values)
    const buckets = getBuckets(min, max, bucketCount)
    const counts = Array(bucketCount).fill(0)

    values.forEach(value => {
      const bucketIndex = buckets.findIndex(
        bucket => bucket.min <= value && value <= bucket.max
      )

      counts[bucketIndex]++
    })

    const series = buckets.map((bucket, index) => ({
      x: `${bucket.min} – ${bucket.max}`,
      y: counts[index],
    }))

    return [{ data: series }]
  }

  const getValuesRange = values => {
    // Ensure min is nearest integer including the actual minimum e.g.`-10.2` -> `-11`
    const min = Math.floor(Math.min(...values))
    // Ensure max is nearest integer including the actual maximum e.g. `20.2` -> `21`
    const max = Math.ceil(Math.max(...values))

    return [min, max]
  }

  const getBuckets = (min, max, bucketCount) => {
    // Assure bucketCount is >= 2 and an integer
    bucketCount = bucketCount < 2 ? 2 : Math.floor(bucketCount)

    const range = max - min
    // Assure bucketSize is never a decimal value, we'll redistribute any size truncated here later
    const bucketSize = Math.floor(range / bucketCount)
    const bucketRemainder = range - bucketSize * bucketCount

    const buckets = []

    for (let i = 0; i < bucketCount; i++) {
      const lastBucketMax = buckets?.[buckets.length - 1]?.max ?? min
      // Distribute any remaining size, the remainder will never be larger than the number of buckets
      const remainderPadding = i < bucketRemainder ? 1 : 0

      buckets.push({
        min: lastBucketMax,
        max: lastBucketMax + bucketSize + remainderPadding,
      })
    }

    return buckets
  }

  const getFormatter = (horizontal, axis) => {
    // Don't display decimals in between integers on the value axis
    if ((horizontal && axis === "x") || (!horizontal && axis === "y")) {
      return value => {
        if (Math.floor(value) === value) {
          return value
        }

        // Returning an empty string or even a normal space here causes Apex Charts to push the value axis label of the screen
        // This is an `em space`, `U+2003`
        return " "
      }
    }

    return value => value
  }
</script>

<ApexChart {options} />
