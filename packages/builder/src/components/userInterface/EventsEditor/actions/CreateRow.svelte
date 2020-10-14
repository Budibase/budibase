<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import SaveFields from "./SaveFields.svelte"

  export let parameters

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.currentComponentInfo._id,
    components: $store.components,
    screen: $store.currentPreviewItem,
    tables: $backendUiStore.tables,
  })

  // just wraps binding in {{ ... }}
  const toBindingExpression = bindingPath => `{{ ${bindingPath} }}`

  const tableFields = tableId => {
    const table = $backendUiStore.tables.find(m => m._id === tableId)

    return Object.keys(table.schema).map(k => ({
      name: k,
      type: table.schema[k].type,
    }))
  }

  $: schemaFields =
    parameters && parameters.tableId ? tableFields(parameters.tableId) : []

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">
  <Label size="m" color="dark">Table</Label>
  <Select secondary bind:value={parameters.tableId}>
    <option value="" />
    {#each $backendUiStore.tables as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>

  {#if parameters.tableId}
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
