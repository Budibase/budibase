<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { tables } from "stores/backend"
  import { getBindableProperties } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

  export let parameters

  $: tableOptions = $tables.list || []
  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
</script>

<div class="root">
  <Label>Table</Label>
  <Select
    bind:value={parameters.tableId}
    options={tableOptions}
<<<<<<< HEAD
    getOptionLabel={(table) => table.name}
    getOptionValue={(table) => table._id}
=======
    getOptionLabel={table => table.name}
    getOptionValue={table => table._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
  />

  <Label small>Row ID</Label>
  <DrawerBindableInput
    {bindings}
    title="Row ID to delete"
    value={parameters.rowId}
<<<<<<< HEAD
    on:change={(value) => (parameters.rowId = value.detail)}
=======
    on:change={value => (parameters.rowId = value.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
  />

  <Label small>Row Rev</Label>
  <DrawerBindableInput
    {bindings}
    title="Row rev to delete"
    value={parameters.revId}
<<<<<<< HEAD
    on:change={(value) => (parameters.revId = value.detail)}
=======
    on:change={value => (parameters.revId = value.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr;
    align-items: baseline;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
