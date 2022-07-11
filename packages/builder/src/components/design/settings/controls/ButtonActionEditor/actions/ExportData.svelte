<script>
  import { Label, Select, Body, Multiselect } from "@budibase/bbui"
  import {
    findAllMatchingComponents,
    findComponent,
  } from "builderStore/componentUtils"
  import { currentAsset } from "builderStore"
  import { onMount } from "svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"

  export let parameters

  const FORMATS = [
    {
      label: "CSV",
      value: "csv",
    },
    {
      label: "JSON",
      value: "json",
    },
  ]

  $: tables = findAllMatchingComponents($currentAsset?.props, component =>
    component._component.endsWith("table")
  ).map(table => ({
    label: table._instanceName,
    value: table._id,
  }))
  $: tableBlocks = findAllMatchingComponents($currentAsset?.props, component =>
    component._component.endsWith("tableblock")
  ).map(block => ({
    label: block._instanceName,
    value: `${block._id}-table`,
  }))
  $: componentOptions = tables.concat(tableBlocks)
  $: columnOptions = getColumnOptions(parameters.tableComponentId)

  const getColumnOptions = tableId => {
    // Strip block suffix if block component
    if (tableId?.includes("-")) {
      tableId = tableId.split("-")[0]
    }
    const selectedTable = findComponent($currentAsset?.props, tableId)
    const datasource = getDatasourceForProvider($currentAsset, selectedTable)
    const { schema } = getSchemaForDatasource($currentAsset, datasource)
    return Object.keys(schema || {})
  }

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "csv"
    }
  })
</script>

<div class="root">
  <Body size="S">
    Choose the table component that you would like to export your row selection
    from.
    <br />
    Please ensure you have enabled row selection in the table settings.
  </Body>

  <div class="params">
    <Label small>Table</Label>
    <Select
      bind:value={parameters.tableComponentId}
      options={componentOptions}
      on:change={() => (parameters.columns = [])}
    />
    <Label small>Export as</Label>
    <Select bind:value={parameters.type} options={FORMATS} />
    <Label small>Export columns</Label>
    <Multiselect
      placeholder="All columns"
      bind:value={parameters.columns}
      options={columnOptions}
    />
  </div>
</div>

<style>
  .root {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-xs);
    row-gap: var(--spacing-s);
    grid-template-columns: 90px 1fr;
    align-items: center;
  }
</style>
