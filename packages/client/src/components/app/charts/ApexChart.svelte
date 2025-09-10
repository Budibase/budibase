<script>
  import { onMount } from "svelte"
  
  let ApexChartComponent
  export let options

  onMount(async () => {
    // eslint-disable-next-line no-undef
    if (__USE_DYNAMIC_LOADING__) {
      ApexChartComponent = (await import("./ApexChart/ApexChart.new.svelte")).default
    } else {
      ApexChartComponent = (await import("./ApexChart/ApexChart.old.svelte")).default
    }
  })
</script>

{#if ApexChartComponent}
  <svelte:component this={ApexChartComponent} {options} />
{/if}