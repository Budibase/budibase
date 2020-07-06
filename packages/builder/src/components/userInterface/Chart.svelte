<script>
  import { onMount } from "svelte";

  //expose chart types for use or reference outside compnent
  export const chartTypes = britecharts ? Object.keys(britecharts) : null;

  //TODO: How do I access this from outside the component?
  //expose chart color schemas for use or reference outside compnent
  export const colorSchemas = britecharts
    ? britecharts.colors.colorSchemas
    : null;

  export const colorGradients = britecharts
    ? britecharts.colors.colorGradients
    : null;

  export let type = "bar";
  export let data = [];

  export let colors = britecharts
    ? britecharts.colors.colorSchemas.britecharts
    : null;

  let chartElement = null;
  let chartContainer = null;

  let chart = chartTypes.includes(type) ? britecharts[type]() : null;

  onMount(() => {
    //TODO: Error handling if can't find britecharts or d3Selection
    if (chart) {
      chartContainer = d3.select(chartElement);
      bindChartColors();
      bindChartUIProps();
      chartContainer.datum(data).call(chart);
    }
  });

  function bindChartColors() {
    /* 
    TODO: some charts support gradients, others support colours.Find out and cater for this here
        Can a chart support support both color and gradient schemas?
        Can a chart support no colors or gradients
        Can a user define there own color schema? 
    */
    if (chart.colorSchema) {
      chart.colorSchema(colors);
    }
  }

  //TODO: Ability to match height and width of container (similar to how this is done in docs). Maybe default this if no width or height
  function bindChartUIProps() {
    const props = Object.entries($$props);

    for (let [prop, value] of props) {
      if (validChartProps.includes(prop)) {
        chart[prop](value);
      }
    }
  }

  $: validChartProps = chart ? Object.getOwnPropertyNames(chart) : null;
</script>

<div bind:this={chartElement} class="chart-container" />
