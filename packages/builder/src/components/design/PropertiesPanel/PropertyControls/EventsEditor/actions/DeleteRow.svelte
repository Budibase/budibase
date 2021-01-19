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
    $currentAsset.props,
    $store.selectedComponentId
  )
  $: {
    // Automatically set rev and table ID based on row ID
    if (parameters.rowId) {
      parameters.revId = parameters.rowId.replace("_id", "_rev")
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
    <Label size="m" color="dark">Datasource</Label>
    <Select secondary bind:value={parameters.rowId}>
      <option value="" />
      {#each dataProviderComponents as provider}
        <option value={`{{ ${provider._id}._id }}`}>
          {provider._instanceName}
        </option>
      {/each}
    </Select>
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-s);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: baseline;
  }

  .root :global(> div:nth-child(2)) {
    grid-column-start: 2;
    grid-column-end: 6;
  }

  .cannot-use {
    color: var(--red);
    font-size: var(--font-size-s);
    text-align: center;
    width: 70%;
    margin: auto;
  }
</style>
