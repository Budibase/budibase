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
    $currentAsset.props,
    $store.selectedComponentId
  )
  $: providerComponent = dataProviderComponents.find(
    provider => provider._id === parameters.providerId
  )
  $: schemaFields = getSchemaFields(providerComponent)

  const getSchemaFields = component => {
    const datasource = getDatasourceForProvider(component)
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
    <Label size="m" color="dark">Datasource</Label>
    <Select secondary bind:value={parameters.providerId}>
      <option value="" />
      {#each dataProviderComponents as provider}
        <option value={provider._id}>{provider._instanceName}</option>
      {/each}
    </Select>
  {/if}

  {#if parameters.contextPath}
    <SaveFields
      parameterFields={parameters.fields}
      {schemaFields}
      on:fieldschanged={onFieldsChanged} />
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
