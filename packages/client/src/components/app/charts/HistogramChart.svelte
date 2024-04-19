<script>
  import { ApexOptionsBuilder } from "./ApexOptionsBuilder"
  import ApexChart from "./ApexChart.svelte"
  import { get } from "lodash";
  import formatters from "./formatters"

  export let dataProvider
  export let valueColumn
  export let title
  export let xAxisLabel
  export let yAxisLabel
  export let height
  export let width
  export let dataLabels
  export let animate
  export let legend
  export let stacked
  export let palette
  export let c1, c2, c3, c4, c5
  export let horizontal
  export let bucketCount = 10

  $: series = getSeries(dataProvider, valueColumn, bucketCount)

  $: options = {
    /*
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
    // Providing `type: "datetime"` normally makes Apex Charts parse epochs nicely with no additonal config, but bar charts in horizontal mode don't have a default setting for parsing the labels of dates, and will just spit out the unix epoch value. It also doesn't seem to respect any date based formatting properties passed in. So we'll just manualy format the labels, the chart still sorts the dates correctly in any case
    yaxis: {
      labels: {
        formatter: yAxisFormatter
      },
      title: {
        text: yAxisLabel
      }
    }
*/
  }

  const getSeries = (dataProvider, valueColumn, bucketCount) => {
    const rows = dataProvider.rows ?? [];

    const values = rows.map(row => parseFloat(row[valueColumn]))
    const [min, max] = getValuesRange(values)
    console.log(min, max);
    const buckets = getBuckets(min, max, bucketCount)
  }

  const getValuesRange = (values) => {
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
    let bucketRemainder = range - (bucketSize * bucketCount)

    const buckets = []

    for (let i = 0; i < bucketCount; i++) {
      const lastBucketMax = buckets?.[buckets.length - 1]?.max ?? min
      const remainderPadding = i < bucketRemainder ? 1 : 0

      buckets.push({
        min: lastBucketMax,
        max: lastBucketMax + bucketSize + remainderPadding
      })
    }

    console.log(range);
    console.log(bucketSize);
    console.log(bucketRemainder)
    console.log(buckets);

    return buckets;

  }
</script>

<ApexChart {options} />
