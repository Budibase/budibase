<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import {
    getDataProviderComponents,
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import SaveFields from "./SaveFields.svelte"

  export let parameters

  $: dataProviderComponents = getDataProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  )
  $: providerComponent = dataProviderComponents.find(
    provider => provider._id === parameters.providerId
  )
  $: schemaFields = getSchemaFields($currentAsset, providerComponent)

  const getSchemaFields = (asset, component) => {
    const datasource = getDatasourceForProvider(asset, component)
    const { schema } = getSchemaForDatasource(datasource)
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  {#if !dataProviderComponents.length}
    <div class="cannot-use">
      Save Row can only be used within a component that provides data, such as a
      Repeater
    </div>
  {:else}
    <Label small>Datasource</Label>
    <Select thin secondary bind:value={parameters.providerId}>
      <option value="" />
      {#each dataProviderComponents as provider}
        <option value={provider._id}>{provider._instanceName}</option>
      {/each}
    </Select>

    {#if parameters.providerId}
      <SaveFields
        parameterFields={parameters.fields}
        {schemaFields}
        on:change={onFieldsChanged} />
    {/if}
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
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
    margin: auto;
  }
</style>
