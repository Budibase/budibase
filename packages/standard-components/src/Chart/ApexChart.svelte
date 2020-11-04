<script>
  import { chart } from "svelte-apexcharts"

  export let options
</script>

{#if options}
  <div use:chart={options} />
{:else}
  <div>Invalid chart options</div>
{/if}

<style>
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
</style>
