<p align="center"><img src="https://apexcharts.com/media/apexcharts-logo.png"></p>

<p align="center">
  <a href="https://github.com/apexcharts/react-apexcharts/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-brightgreen.svg" alt="License"></a>

<p align="center">Svelte wrapper for <a href="https://github.com/apexcharts/apexcharts.js">ApexCharts</a> to build interactive visualizations in svelte.</p>

<p align="center"><a href="https://apexcharts.com/react-chart-demos/"><img src="https://apexcharts.com/media/apexcharts-banner.png"></a></p>

## Download and Installation

##### Installing via npm

```bash
npm install svelte-apexcharts apexcharts
```

## Usage

```js
<script>
  import { chart } from "svelte-apexcharts";
  let options = {
    chart: {
      type: "bar",
    },
    series: [
      {
        name: "sales",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };
</script>

<div use:chart={options} />

```

This will render the following chart

<p align="center"><a href="https://apexcharts.com/javascript-chart-demos/column-charts/"><img src="https://apexcharts.com/media/first-bar-chart.svg"></a></p>

### How do I update the chart?

Simple! Just change the `options` and it will automatically re-render the chart.

<p align="center"><a href="#"><img src="https://apexcharts.com/media/react-chart-updation.gif"></a></p>

## Props

| Prop        | Type   | Description                                                                                                 |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| **options** | Object | The configuration object, see options on [API (Reference)](https://apexcharts.com/docs/options/chart/type/) |

## License

Svelte-ApexCharts is released under MIT license. You are free to use, modify and distribute this software, as long as the copyright header is left intact.
