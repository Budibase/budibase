<script>
  import { Select, Label } from "@budibase/bbui"
  import { store, currentAsset, backendUiStore } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

  export let parameters

  $: tableOptions = $backendUiStore.tables || []
  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
</script>

<div class="root">
  <Label small>Table</Label>
  <Select thin secondary bind:value={parameters.tableId}>
    <option value="" />
    {#each tableOptions as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>

  <Label small>Row ID</Label>
  <DrawerBindableInput
    {bindings}
    value={parameters.rowId}
    on:change={value => (parameters.rowId = value.detail)} />

  <Label small>Row Rev</Label>
  <DrawerBindableInput
    {bindings}
    value={parameters.revId}
    on:change={value => (parameters.revId = value.detail)} />
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
