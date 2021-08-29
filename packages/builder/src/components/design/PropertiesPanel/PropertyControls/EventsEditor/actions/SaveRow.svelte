<script>
  import { Select, Label, Body, Checkbox, Input } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import {
    getDataProviderComponents,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import SaveFields from "./SaveFields.svelte"
  import { _ as t } from "svelte-i18n"

  export let parameters
  export let bindings = []

  $: dataProviderComponents = getDataProviderComponents(
    $currentAsset,
    $store.selectedComponentId
  )
  $: schemaFields = getSchemaFields($currentAsset, parameters?.tableId)
  $: tableOptions = $tables.list || []

  const getSchemaFields = (asset, tableId) => {
    const { schema } = getSchemaForDatasource(asset, { type: "table", tableId })
    return Object.values(schema || {})
  }

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Body size="S">
    {$t(
      "choosing-a-data-source-will-automatically-use-the-data-it-provides-but-its-optional"
    )}<br />
    {$t("you-can-always-add-or-override-fields-manually")}
  </Body>

  <div class="params">
    <Label small>{$t("data-source")}</Label>
    <Select
      bind:value={parameters.providerId}
      options={dataProviderComponents}
      placeholder="None"
      getOptionLabel={option => option._instanceName}
      getOptionValue={option => option._id}
    />

    <Label small>{$t("table")}</Label>
    <Select
      bind:value={parameters.tableId}
      options={tableOptions}
      getOptionLabel={option => option.name}
      getOptionValue={option => option._id}
    />

    <Label small />
    <Checkbox
      text={$t("require-confirmation")}
      bind:value={parameters.confirm}
    />

    {#if parameters.confirm}
      <Label small>{$t("confirm-text")}</Label>
      <Input
        placeholder={$t("are-you-sure-you-want-to-save-this-row")}
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
