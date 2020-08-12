<script>
  import { notNull } from "./utils"
  import { onMount } from "svelte"
  import { select } from "d3-selection"

  import britecharts from "britecharts"

  export const tooltip = britecharts.tooltip()

  export let chartClass = ""
  let tooltipContainer

  export let axisTimeCombinations = null
  export let dateCustomFormat = null
  export let dateFormat = null
  export let dateLabel = null
  export let locale = null
  export let nameLabel = null
  export let numberFormat = null
  export let shouldShowDateInTitle = false
  export let title = "My Tooltip"
  export let tooltipOffset = null
  export let topicLabel = "values"
  export let topicsOrder = null
  export let valueLabel = null
  export let xAxisValueType = null

  onMount(() => {
    tooltipContainer = select(`.${chartClass} .metadata-group`)
    tooltipContainer.datum([]).call(tooltip)
  })

  $: if (tooltipContainer) {
    if (notNull(axisTimeCombinations)) {
      tooltip.axisTimeCombinations(axisTimeCombinations)
    }
    if (notNull(dateCustomFormat)) {
      tooltip.dateCustomFormat(dateCustomFormat)
    }
    if (notNull(dateFormat)) {
      tooltip.dateFormat(dateFormat)
    }
    if (notNull(dateLabel)) {
      tooltip.dateLabel(dateLabel)
    }
    if (notNull(locale)) {
      tooltip.locale(locale)
    }
    if (notNull(nameLabel)) {
      tooltip.nameLabel(nameLabel)
    }
    if (notNull(numberFormat)) {
      tooltip.numberFormat(numberFormat)
    }
    if (notNull(shouldShowDateInTitle)) {
      tooltip.shouldShowDateInTitle(shouldShowDateInTitle)
    }
    if (notNull(title)) {
      tooltip.title(title)
    }
    if (notNull(tooltipOffset)) {
      tooltip.tooltipOffset(tooltipOffset)
    }
    if (notNull(topicLabel)) {
      tooltip.topicLabel(topicLabel)
    }
    if (notNull(topicsOrder)) {
      tooltip.topicsOrder(topicsOrder)
    }
    if (notNull(valueLabel)) {
      tooltip.valueLabel(valueLabel)
    }
    if (notNull(xAxisValueType)) {
      tooltip.xAxisValueType(xAxisValueType)
    }

    tooltipContainer.datum([]).call(tooltip)
  }
</script>
