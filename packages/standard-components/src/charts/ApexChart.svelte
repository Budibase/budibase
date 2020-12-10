<script>
  import { getContext } from "svelte"
  import { chart } from "svelte-apexcharts"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let options
</script>

{#if options}
  <div use:chart={options} use:styleable={$component.styles} />
{:else if options === false}
  <div use:styleable={$component.styles}>
    Use the settings panel to build your chart -->
  </div>
{/if}

<style>
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
</style>
