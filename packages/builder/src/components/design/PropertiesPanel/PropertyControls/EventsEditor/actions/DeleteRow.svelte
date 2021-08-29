<script>
  import { Select, Label, Checkbox, Input } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ as t } from "svelte-i18n"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list || []
</script>

<div class="root">
  <Label>{$t("table")}</Label>
  <Select
    bind:value={parameters.tableId}
    options={tableOptions}
    getOptionLabel={table => table.name}
    getOptionValue={table => table._id}
  />

  <Label small>{$t("row-id")}</Label>
  <DrawerBindableInput
    {bindings}
    title={$t("row-id-to-delete")}
    value={parameters.rowId}
    on:change={value => (parameters.rowId = value.detail)}
  />

  <Label small>{$t("row-rev")}</Label>
  <DrawerBindableInput
    {bindings}
    title={$t("row-rev-to-delete")}
    value={parameters.revId}
    on:change={value => (parameters.revId = value.detail)}
  />

  <Label small />
  <Checkbox text={$t("require-confirmation")} bind:value={parameters.confirm} />

  {#if parameters.confirm}
    <Label small>{$t("confirm-text")}</Label>
    <Input
      placeholder={$t("are-you-sure-you-want-to-delete-this-row")}
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
