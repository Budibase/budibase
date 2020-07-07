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

  export let type = "bar";
  export let data = [];
  export let tooltipProps = null;

  export let colors = colorSchemas ? colorSchemas.britecharts : null;

  export let gradients = colorGradients ? colorGradients.bluePurple : null;

  let chartElement = null;
  let chartContainer = null;
  let tooltipContainer = null;

  let tooltipElement = null;

  let chart = chartTypes.includes(type) ? britecharts[type]() : null;
  export let tooltip = null; //can bind and therefore access

  onMount(() => {
    if (chart) {
      chartContainer = d3.select(chartElement);
      bindChartColors();
      bindChartTooltip();
      bindChartUIProps();
      bindChartEvents();
      chartContainer.datum(data).call(chart);
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

      const validTooltipProps = Object.getOwnPropertyNames(tooltip);

      const props = Object.entries(tooltipProps);
      for (let [key, value] of props) {
        if (validTooltipProps.includes(key)) {
          tooltip[key](value);
        }
      }

      tooltipContainer = d3.select(tooltipElement);
      tooltipContainer.datum([]).call(tooltip);
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

  function bindChartEvents() {
    if ($$props.on) {
      const events = Object.entries($$props.on);
      for (let [type, fn] of events) {
        chart.on(type, fn);
      }
    }
  }

  function bindChartUIProps() {
    const props = Object.entries(
      excludeProps($$props, ["data", "colors", "type", "gradients", "on"])
    );

    if (!props.includes("width")) {
      chart.width(chartElement.getBoundingClientRect().width);
    }

    for (let [prop, value] of props) {
      if (validChartProps.includes(prop)) {
        chart[prop](value);
      } else {
        console.warn(
          `${type} chart - ${prop} is an unrecognised prop and wont be applied`
        );
      }
    }
  }

  $: validChartProps = chart ? Object.getOwnPropertyNames(chart) : null;
  $: canUseTooltip = type === "groupedBar" && tooltipProps;
  $: console.log("VALID CHART PROPS", validChartProps);
</script>

<div bind:this={chartElement} class="chart-container" />

{#if canUseTooltip}
  <div bind:this={tooltipElement} class="tooltip-container" />
{/if}
