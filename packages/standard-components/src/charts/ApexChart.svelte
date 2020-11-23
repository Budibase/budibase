<script>
  import { getContext } from "svelte"
  import { chart } from "svelte-apexcharts"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

  export let options
</script>

{#if options}
  <div use:chart={options} use:styleable={styles} />
{:else if options === false}
  <div use:styleable={styles}>Invalid chart options</div>
{/if}

<style>
  div :global(.apexcharts-legend-series) {
    display: flex !important;
    text-transform: capitalize;
  }
</style>
