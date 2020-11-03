<script>
  import { chart } from "svelte-apexcharts"

  export let options
</script>

<div use:chart={options} />

<style>
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
</style>
