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
  $: tableOptions = $tables || []

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
    <Select thin secondary bind:value={parameters.providerId}>
      <option value="">None</option>
      {#each dataProviderComponents as provider}
        <option value={provider._id}>{provider._instanceName}</option>
      {/each}
    </Select>

    <Label small>Table</Label>
    <Select thin secondary bind:value={parameters.tableId}>
      <option value="" />
      {#each tableOptions as table}
        <option value={table._id}>{table.name}</option>
      {/each}
    </Select>

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
    align-items: baseline;
  }

  .fields :global(> div:nth-child(2)),
  .fields :global(> div:nth-child(4)) {
    grid-column-start: 2;
    grid-column-end: 6;
  }
</style>
