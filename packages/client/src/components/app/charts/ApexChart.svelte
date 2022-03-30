<script>
  import { getContext } from "svelte"
  import { chart } from "svelte-apexcharts"
  import Placeholder from "../Placeholder.svelte"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let options
</script>

{#if options}
  <div use:chart={options} use:styleable={$component.styles} />
{:else if $builderStore.inBuilder}
  <div use:styleable={$component.styles}>
    <Placeholder text="Use the settings panel to build your chart" />
  </div>
{/if}

<style>
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
  div :global(.apexcharts-yaxis-label),
  div :global(.apexcharts-xaxis-label) {
    fill: var(--spectrum-global-color-gray-600);
  }

  div :global(.apexcharts-gridline) {
    stroke: var(--spectrum-global-color-gray-600);
  }
  div :global(.apexcharts-legend-text) {
    color: var(--spectrum-global-color-gray-700) !important;
  }
  div :global(.apexcharts-datalabel) {
    fill: var(--spectrum-global-color-gray-800);
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
</style>
