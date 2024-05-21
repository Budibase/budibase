<script>
  import { getContext } from "svelte"
  import ApexCharts from "apexcharts"
  import { Icon } from "@budibase/bbui"
  import { cloneDeep } from "./utils"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let options

  // Apex charts directly modifies the options object with default properties and internal variables. These being present could unintentionally cause issues to the provider of this prop as the changes are reflected in that component as well. To prevent any issues we clone options here to provide a buffer.
  $: optionsCopy = cloneDeep(options)

  let chartElement
  let chart
  let currentType = null

  const updateChart = async newOptions => {
    // Line charts have issues transitioning between "datetime" and "category" types, and will ignore the provided formatters
    // in certain scenarios. Rerendering the chart when the user changes label type fixes this, but unfortunately it does
    // cause a little bit of jankiness with animations.
    if (newOptions?.xaxis?.type && newOptions.xaxis.type !== currentType) {
      await renderChart(chartElement)
    } else {
      await chart?.updateOptions(newOptions)
    }
  }

  const renderChart = async newChartElement => {
    try {
      await chart?.destroy()
      chart = new ApexCharts(newChartElement, optionsCopy)
      currentType = optionsCopy?.xaxis?.type
      await chart.render()
    } catch (e) {
      // Apex for some reason throws this error when creating a new chart.
      // It doesn't actually cause any issues with the function of the chart, so
      // just suppress it so the console doesn't get spammed
      if (
        e.message !==
        "Cannot read properties of undefined (reading 'parentNode')"
      ) {
        throw e
      }
    }
  }

  $: noData = optionsCopy == null || optionsCopy?.series?.length === 0

  // Call render chart upon changes to noData, as apex charts has issues with rendering upon changes automatically
  // if the chart is hidden.
  $: renderChart(chartElement, noData)
  $: updateChart(optionsCopy)
</script>

{#key optionsCopy?.customColor}
  <div
    class:hide={noData}
    use:styleable={$component.styles}
    bind:this={chartElement}
  />
  {#if $builderStore.inBuilder && noData}
    <div
      class="component-placeholder"
      use:styleable={{
        ...$component.styles,
        normal: {},
        custom: null,
        empty: true,
      }}
    >
      <Icon name="Alert" color="var(--spectrum-global-color-static-red-600)" />
      Add rows to your data source to start using your component
    </div>
  {/if}
{/key}

<style>
  .hide {
    display: none;
  }
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
  div :global(.apexcharts-text.apexcharts-xaxis-title-text),
  div :global(.apexcharts-text.apexcharts-yaxis-title-text),
  div :global(.apexcharts-text.apexcharts-xaxis-label),
  div :global(.apexcharts-text.apexcharts-yaxis-label),
  div :global(.apexcharts-title-text) {
    fill: var(--spectrum-global-color-gray-600);
  }

  div :global(.apexcharts-gridline) {
    stroke: var(--spectrum-global-color-gray-600);
  }
  div :global(.apexcharts-legend-text) {
    color: var(--spectrum-global-color-gray-700) !important;
  }
  div :global(.apexcharts-datalabel) {
    fill: white;
  }
  div :global(.apexcharts-tooltip) {
    background-color: var(--spectrum-global-color-gray-200) !important;
    border-color: var(--spectrum-global-color-gray-300) !important;
    box-shadow: 2px 2px 6px -4px rgba(0, 0, 0, 0.1) !important;
  }
  div :global(.apexcharts-tooltip-title) {
    background-color: var(--spectrum-global-color-gray-100) !important;
    border-color: var(--spectrum-global-color-gray-300) !important;
  }
  div :global(.apexcharts-theme-dark .apexcharts-tooltip-text) {
    color: white;
  }
  div
    :global(
      .apexcharts-theme-dark .apexcharts-tooltip-series-group.apexcharts-active
    ) {
    padding-bottom: 0;
  }

  .component-placeholder {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    padding: var(--spacing-xs);
    gap: var(--spacing-s);
  }

  /* Common styles for all error states to use */
  .component-placeholder :global(mark) {
    background-color: var(--spectrum-global-color-gray-400);
    padding: 0 4px;
    border-radius: 2px;
  }
  .component-placeholder :global(.spectrum-Link) {
    cursor: pointer;
  }
</style>
