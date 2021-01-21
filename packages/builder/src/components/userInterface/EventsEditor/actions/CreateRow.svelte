<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, backendUiStore, currentAsset } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import SaveFields from "./SaveFields.svelte"

  export let parameters

  $: bindableProperties = fetchBindableProperties({
    componentInstanceId: $store.selectedComponentId,
    components: $store.components,
    screen: $currentAsset,
    tables: $backendUiStore.tables,
    queries: $backendUiStore.queries,
  })

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
</style>
