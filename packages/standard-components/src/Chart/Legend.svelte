<script>
  import britecharts from "britecharts"
  import { notNull } from "./utils"
  import { select } from "d3-selection"
  import { onMount } from "svelte"

  export let useLegend = true
  export let data = []
  export let width = null
  export let height = null
  export let colorSchema = null
  export let highlight = null
  export let highlightByEntryId = null
  export let isHorizontal = false
  export let margin = null
  export let marginRatio = null
  export let markerSize = null
  export let numberFormat = null
  export let unit = null

  export let legend = britecharts.legend() //exported it can be bound to
  let legendContainer = null
  let legendElement = null

  $: {
    if (legendElement) {
      legendContainer = select(legendElement)
      legend.numberFormat(".0f")

      if (width) {
        legend.width(width)
      }

      if (notNull(height)) {
        legend.height(height)
      }

      if (notNull(colorSchema)) {
        legend.colorSchema(colorSchema)
      }

      if (notNull(highlight)) {
        legend.highlight(highlight)
      }

      if (notNull(highlightByEntryId)) {
        legend.highlightByEntryId(highlightByEntryId)
      }

      if (notNull(isHorizontal)) {
        legend.isHorizontal(isHorizontal)
      }

      if (notNull(margin)) {
        legend.margin(margin)
      }

      if (notNull(marginRatio)) {
        legend.marginRatio(marginRatio)
      }

      if (notNull(markerSize)) {
        legend.markerSize(markerSize)
      }

      if (notNull(numberFormat)) {
        legend.numberFormat(numberFormat)
      }

      if (notNull(unit)) {
        legend.unit(unit)
      }
      legendContainer.datum(data).call(legend)
    }
  }

  const legendClass = `legend-container`
</script>

{#if useLegend}
  <div bind:this={legendElement} class={legendClass} />
{/if}
