<script context="module">
  //expose chart types for use or reference outside compnent
  export const chartTypes = britecharts ? Object.keys(britecharts) : null;

  //expose chart color schemas for use or reference outside compnent
  export const colorSchemas = britecharts
    ? britecharts.colors.colorSchemas
    : null;

  //export color gradients for use or reference outside the component
  export const colorGradients = britecharts
    ? britecharts.colors.colorGradients
    : null;
</script>

<script>
  import { onMount } from "svelte";
  import shortid from "shortid"

  const _id = shortid.generate()

  export let type = "bar";
  export let data = [];
  export let tooltipProps = null;
  export let legendProps = null;
  export let useTooltip = false;
  export let useLegend = false;

  export let colors = colorSchemas ? colorSchemas.britecharts : null;
  export let gradients = colorGradients ? colorGradients.bluePurple : null;
  export let tooltip = null; //can bind to outside the component and therefore access

  let chartElement = null;
  let chartContainer = null;
  let tooltipContainer = null;
  let legendContainer = null;
  let legend = null;

  let chart = chartTypes.includes(type) ? britecharts[type]() : null;

  const chartClass = `chart-container-${_id}` 
  const legendClass = `legend-container-${_id}`

  onMount(() => {
    if (chart) {
      chartContainer = d3.select(`.${chartClass}`);
      bindChartColors();
      bindChartUIProps();
      bindChartEvents();
      chartContainer.datum(data).call(chart);
      bindChartTooltip();
      bindChartLegend();
    } else {
      console.error("Britecharts could not be found");
    }
  });

  function bindChartColors() {
    if (chart.colorSchema) {
      chart.colorSchema(colors);
    } else if (chart.gradient) {
      chart.gradient(gradients);
    }
  }

  function bindChartTooltip() {
    if (canUseTooltip) {
      tooltip = britecharts.tooltip();

      bindProps(tooltip, tooltipProps)

      tooltipContainer = d3.select(`.${chartClass} .metadata-group .vertical-marker-container`);
      tooltipContainer.datum([]).call(tooltip);
      // tooltip.show()
    }
  }

  function bindChartLegend() {
    if(useLegend) {

      if(!Array.isArray(data)) {
        console.warn("Cannot use legend as data is not an array")
        return;
      }

      let excludeProps = []

      legend = britecharts.legend();

      if(!legendProps || !legendProps.width) {
        excludeProps = ["width"]
        legend.width(chart.width())
      }
  
      if(legendProps){
        bindProps(legend, legendProps, excludeProps)
      }
  
      legendContainer = d3.select(`.${legendClass}`)
      legendContainer.datum(data).call(legend)
    }
  }

  function bindChartEvents() {
    if ($$props.on) {
      const events = Object.entries($$props.on);
      for (let [type, fn] of events) {
        chart.on(type, fn);
      }
    }
  }

  function bindChartUIProps() {
    const excludeProps = ["data", "colors", "type", "gradients", "on", "useTooltip", "tooltip", "tooltipProps", "legendProps", "useLegend"]

    if (!$$props.width) {
      chart.width(chartElement.getBoundingClientRect().width);
    }

    bindProps(chart, $$props, excludeProps)
  }

  function bindProps(element, elProps, excludeArray) {
    const props = excludeArray ? Object.entries(excludeProps(elProps, excludeArray)) : Object.entries(elProps)
    
    const validElementProps = Object.getOwnPropertyNames(element);

    for (let [prop, value] of props) {
      if (validElementProps.includes(prop)) {
        chart[prop](value);
      } else {
        console.warn(
          `${type} - ${prop} is an unrecognised chart prop and wont be applied`
        );
      }
    }
  }

  function excludeProps(props, propsToExclude) {
    const modifiedProps = {};
    for (const prop in props) {
      if (!propsToExclude.includes(prop)) {
        modifiedProps[prop] = props[prop];
      }
    }
    return modifiedProps;
  }

  $: validChartProps = chart ? Object.getOwnPropertyNames(chart) : null;
  $: canUseTooltip = type === "groupedBar" && tooltipProps && useTooltip;
  
</script>

<div bind:this={chartElement} class={chartClass} />
{#if useLegend}
  <div class={legendClass}/>
{/if}