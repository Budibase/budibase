<script>
import ApexChartNew from "./ApexChart/ApexChart.new.svelte"
import ApexChartOld from "./ApexChart/ApexChart.old.svelte"
  

  let ApexChartComponent

  // @ts-ignore
  if (__USE_DYNAMIC_LOADING__) {
    ApexChartComponent = ApexChartNew
  } else {
    ApexChartComponent = ApexChartOld
  }

  export let options
</script>

<svelte:component this={ApexChartComponent} {options} />