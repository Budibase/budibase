<script>
  import Block from "components/Block.svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"

  // Datasource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let autoRefresh

  // Block
  export let chartTitle
  export let chartType
  export let dataSource
  export let palette
  export let c1, c2, c3, c4, c5
  export let labelColumn
  export let legend
  export let animate
  export let dataLabels
  export let height
  export let width

  // Pie/Donut
  export let valueColumn

  // Bar
  export let stacked
  export let horizontal

  // Bar/Line/Area
  export let valueColumns
  export let valueUnits
  export let yAxisLabel
  export let xAxisLabel
  export let yAxisUnits
  export let curve

  // Area
  export let gradient

  // Candlestick
  export let closeColumn
  export let openColumn
  export let highColumn
  export let lowColumn
  export let dateColumn

  // Histogram
  export let bucketCount

  let dataProviderId
</script>

<Block>
  <BlockComponent
    type="dataprovider"
    context="provider"
    bind:id={dataProviderId}
    props={{
      dataSource,
      filter,
      sortColumn,
      sortOrder,
      limit,
      autoRefresh,
    }}
  >
    {#if dataProviderId && chartType}
      <BlockComponent
        type={chartType}
        props={{
          dataProvider: `{{ literal ${safe(dataProviderId)} }}`,
          height,
          width,
          title: chartTitle,
          labelColumn,
          valueColumn,
          valueColumns,
          palette,
          dataLabels,
          legend,
          animate,
          valueUnits,
          yAxisLabel,
          xAxisLabel,
          yAxisUnits,
          stacked,
          horizontal,
          curve,
          gradient, //issue?
          closeColumn,
          openColumn,
          highColumn,
          lowColumn,
          dateColumn,
          bucketCount,
          c1,
          c2,
          c3,
          c4,
          c5,
        }}
      />
    {/if}
  </BlockComponent>
</Block>
