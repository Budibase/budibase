<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { Select, Label, Body, Checkbox, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import {
    getContextProviderComponents,
    getSchemaForTable,
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
  $: schemaFields = getSchemaFields($currentAsset, parameters?.tableId)
  $: tableOptions = $tables.list || []

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

  const getSchemaFields = (asset, tableId) => {
    const { schema } = getSchemaForTable(tableId)
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Body size="S">
    {$_(
      "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.Choosing_Datasource"
    )}<br />
    {$_(
      "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.add_override"
    )}
  </Body>

  <div class="params">
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.Datasource"
      )}</Label
    >
    <Select
      bind:value={parameters.providerId}
      options={providerOptions}
      placeholder={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.None"
      )}
    />

    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.Table"
      )}</Label
    >
    <Select
      bind:value={parameters.tableId}
      options={tableOptions}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />

    <Label small />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.not_display"
      )}
      bind:value={parameters.notificationOverride}
    />
    <br />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.Require_confirmation"
      )}
      bind:value={parameters.confirm}
    />

    {#if parameters.confirm}
      <Label small
        >{$_(
          "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.Confirm text"
        )}</Label
      >
      <Input
        placeholder={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.SaveRow.want_save"
        )}
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
