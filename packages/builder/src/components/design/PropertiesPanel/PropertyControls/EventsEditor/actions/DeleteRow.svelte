<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import {
    getDataProviderComponents,
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"

  export let parameters

  $: dataProviderComponents = getDataProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  )
  $: {
    // Automatically set rev and table ID based on row ID
    if (parameters.providerId) {
      parameters.rowId = `{{ ${parameters.providerId}._id }}`
      parameters.revId = `{{ ${parameters.providerId}._rev }}`
      const providerComponent = dataProviderComponents.find(
        provider => provider._id === parameters.providerId
      )
      const datasource = getDatasourceForProvider(providerComponent)
      const { table } = getSchemaForDatasource(datasource)
      if (table) {
        parameters.tableId = table._id
      }
    }
  }
</script>

<div class="root">
  {#if dataProviderComponents.length === 0}
    <div class="cannot-use">
      Delete row can only be used within a component that provides data, such as
      a List
    </div>
  {:else}
    <Label small>Datasource</Label>
    <Select thin secondary bind:value={parameters.providerId}>
      <option value="" />
      {#each dataProviderComponents as provider}
        <option value={provider._id}>{provider._instanceName}</option>
      {/each}
    </Select>
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr;
    align-items: baseline;
  }

  .cannot-use {
    color: var(--red);
    font-size: var(--font-size-s);
    margin: auto;
  }
</style>
