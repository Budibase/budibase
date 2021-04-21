<script>
  import { Select, Label, Body } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import {
    getDataProviderComponents,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import SaveFields from "./SaveFields.svelte"

  export let parameters

  $: dataProviderComponents = getDataProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  )
  $: schemaFields = getSchemaFields(parameters?.tableId)
  $: tableOptions = $tables.list || []

  const getSchemaFields = tableId => {
    const { schema } = getSchemaForDatasource({ type: "table", tableId })
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Body small grey>
    Choosing a Data Source will automatically use the data it provides, but it's
    optional.<br />
    You can always add or override fields manually.
  </Body>
  <div class="fields">
    <Label small>Data Source</Label>
    <Select
      bind:value={parameters.providerId}
      options={dataProviderComponents}
      placeholder="None"
      getOptionLabel={option => option._instanceName}
      getOptionValue={option => option._id} />

    <Label small>Table</Label>
    <Select
      bind:value={parameters.tableId}
      options={tableOptions}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id} />

    {#if parameters.tableId}
      <SaveFields
        parameterFields={parameters.fields}
        {schemaFields}
        on:change={onFieldsChanged} />
    {/if}
  </div>
</div>

<style>
  .root {
    max-width: 800px;
    margin: 0 auto;
  }

  .root :global(p) {
    line-height: 1.5;
  }

  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: center;
  }

  .fields :global(> div:nth-child(2)),
  .fields :global(> div:nth-child(4)) {
    grid-column-start: 2;
    grid-column-end: 6;
  }
</style>
