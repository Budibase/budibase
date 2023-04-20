<script>
  import { Select, Label, Checkbox, Input } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list || []
</script>

<div class="root">
  <Label
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.Table"
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
      "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.Row ID"
    )}</Label
  >
  <DrawerBindableInput
    {bindings}
    title={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.Row_delete"
    )}
    value={parameters.rowId}
    on:change={value => (parameters.rowId = value.detail)}
  />

  <Label small />
  <Checkbox
    text={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.notification"
    )}
    bind:value={parameters.notificationOverride}
  />
  <br />
  <Checkbox
    text={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.Require_confirmation"
    )}
    bind:value={parameters.confirm}
  />

  {#if parameters.confirm}
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.Confirm_text"
      )}</Label
    >
    <Input
      placeholder={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.DeleteRow.want_delete"
      )}
      bind:value={parameters.confirmText}
    />
  {/if}
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
