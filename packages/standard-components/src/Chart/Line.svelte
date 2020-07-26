<script>
  import Chart, { getColorSchema, getChartGradient } from "./Chart.svelte"

  /*
    ISSUES:
    
  */

  let type = "line"
  let tooltip

  export let data = []
  export let axisTimeCombinations = ""
  export let color = "britecharts"
  export let grid = "horizontal"
  export let aspectRatio = 0.5
  export let dateLabel = "date"
  export let width = null
  export let height = null
  export let isAnimated = true
  export let lineCurve = "linear" //see api for possible opts
  export let locale = "en-GB"
  export let numberFormat = ""
  export let shouldShowAllDataPoints = true
  export let topicLabel = null
  export let valueLabel = null
  export let xAxisLabel = ""
  export let xAxisValueType = "date"
  export let xAxisScale = "linear"
  export let xAxisFormat = "day-month"
  export let xAxisCustomFormat = "%H"

  $: colorSchema = getColorSchema(color)
  $: console.log($$props)
</script>

<Chart
  {type}
  {data}
  {colorSchema}
  {axisTimeCombinations}
  {lineCurve}
  {numberFormat}
  {height}
  {topicLabel}
  {shouldShowAllDataPoints}
  {xAxisLabel}
  {valueLabel}
  {xAxisValueType}
  {xAxisScale}
  {xAxisCustomFormat}
  {aspectRatio}
  {grid}
  tooltipThreshold={600}
  {width}
  {dateLabel} />

<!-- 

isAnimated={true}
aspectRatio={0.5}
grid='horizontal'
tooltipThreshold={600}
width={600}
dateLabel='fullDate'

 {type}
  {data}
  {colorSchema}
  {axisTimeCombinations}
  {lineCurve}
  {numberFormat}
  {height}
  {topicLabel}
  {shouldShowAllDataPoints}
  {xAxisLabel}
  {valueLabel}
  {xAxisValueType}
  {xAxisScale}
  {xAxisCustomFormat}

 -->
