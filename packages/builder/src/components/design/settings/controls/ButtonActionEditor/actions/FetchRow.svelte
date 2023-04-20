<script>
  import { _ } from "../../../../../../../lang/i18n"
  import { Select, Label } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list || []
</script>

<div class="root">
  <Label
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.FetchRow.Table"
    )}</Label
  >
  <Select
    bind:value={parameters.tableId}
    options={tableOptions}
    getOptionLabel={table => table.name}
    getOptionValue={table => table._id}
  />

  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.FetchRow.Row_ID"
    )}</Label
  >
  <DrawerBindableInput
    {bindings}
    title={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.FetchRow.Row_Fetch"
    )}
    value={parameters.rowId}
    on:change={value => (parameters.rowId = value.detail)}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
