<script>
  import { Select, Label, Body, Checkbox, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables, viewsV2 } from "stores/backend"
  import {
    getContextProviderComponents,
    getSchemaForDatasourcePlus,
  } from "builderStore/dataBinding"
  import SaveFields from "./SaveFields.svelte"

  export let parameters
  export let bindings = []
  export let nested

  $: formComponents = getContextProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "form",
    { includeSelf: nested }
  )
  $: schemaComponents = getContextProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "schema"
  )
  $: providerOptions = getProviderOptions(formComponents, schemaComponents)
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

  // Gets a context definition of a certain type from a component definition
  const extractComponentContext = (component, contextType) => {
    const def = store.actions.components.getDefinition(component?._component)
    if (!def) {
      return null
    }
    const contexts = Array.isArray(def.context) ? def.context : [def.context]
    return contexts.find(context => context?.type === contextType)
  }

  // Gets options for valid context keys which provide valid data to submit
  const getProviderOptions = (formComponents, schemaComponents) => {
    const formContexts = formComponents.map(component => ({
      component,
      context: extractComponentContext(component, "form"),
    }))
    const schemaContexts = schemaComponents.map(component => ({
      component,
      context: extractComponentContext(component, "schema"),
    }))
    const allContexts = formContexts.concat(schemaContexts)

    return allContexts.map(({ component, context }) => {
      let runtimeBinding = component._id
      if (context.suffix) {
        runtimeBinding += `-${context.suffix}`
      }
      return {
        label: component._instanceName,
        value: runtimeBinding,
      }
    })
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
