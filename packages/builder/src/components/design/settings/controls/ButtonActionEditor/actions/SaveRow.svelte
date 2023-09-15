<script>
  import { Select, Label, Body, Checkbox, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables, viewsV2 } from "stores/backend"
  import {
    getSchemaForDatasourcePlus,
    getComponentContexts,
  } from "builderStore/dataBinding"
  import SaveFields from "./SaveFields.svelte"

  export let parameters
  export let bindings = []
  export let nested

  $: formContexts = getComponentContexts(
    $currentAsset,
    $store.selectedComponentId,
    "form",
    { includeSelf: nested }
  )
  $: schemaContexts = getComponentContexts(
    $currentAsset,
    $store.selectedComponentId,
    "schema"
  )
  $: providerOptions = getProviderOptions(formContexts, schemaContexts)
  $: schemaFields = getSchemaFields(parameters?.tableId)
  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    resourceId: view.id,
  }))
  $: options = [...(tableOptions || []), ...(viewOptions || [])]

  // Gets options for valid context keys which provide valid data to submit
  const getProviderOptions = (formContexts, schemaContexts) => {
    const allContexts = formContexts.concat(schemaContexts)
    let options = []
    allContexts.forEach(({ component, contexts }) => {
      let runtimeBinding = component._id
      contexts.forEach(context => {
        if (context.suffix) {
          runtimeBinding += `-${context.suffix}`
        }
        options.push({
          label: component._instanceName,
          value: runtimeBinding,
        })
      })
    })
    return options
  }

  const getSchemaFields = resourceId => {
    const { schema } = getSchemaForDatasourcePlus(resourceId)
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Body size="S">
    Choosing a Datasource will automatically use the data it provides, but it's
    optional.<br />
    You can always add or override fields manually.
  </Body>

  <div class="params">
    <Label small>Datasource</Label>
    <Select
      bind:value={parameters.providerId}
      options={providerOptions}
      placeholder="None"
    />

    <Label small>Table</Label>
    <Select
      bind:value={parameters.tableId}
      {options}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.resourceId}
    />

    <Label small />
    <Checkbox
      text="Do not display default notification"
      bind:value={parameters.notificationOverride}
    />
    <br />
    <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small>Confirm text</Label>
      <Input
        placeholder="Are you sure you want to save this row?"
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>

  {#if parameters.tableId}
    <div class="fields">
      <SaveFields
        parameterFields={parameters.fields}
        {schemaFields}
        on:change={onFieldsChanged}
        {bindings}
      />
    </div>
  {/if}
</div>

<style>
  .root {
    width: 100%;
    max-width: 800px;
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
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
  }

  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr auto 1fr auto;
    align-items: center;
  }
</style>
