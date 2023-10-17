<script>
  import { Select, Label, Checkbox, Input, Body } from "@budibase/bbui"
  import { tables, viewsV2 } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    resourceId: view.id,
  }))
  $: options = [...(tableOptions || []), ...(viewOptions || [])]
</script>

<div class="root">
  <Body size="small">Please specify one or more rows to delete.</Body>
  <div class="params">
    <Label>Table</Label>
    <Select
      bind:value={parameters.tableId}
      {options}
      getOptionLabel={x => x.label}
      getOptionValue={x => x.resourceId}
    />

    <Label small>Row IDs</Label>
    <DrawerBindableInput
      {bindings}
      title="Rows to delete"
      value={parameters.rowId}
      on:change={value => (parameters.rowId = value.detail)}
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
        placeholder="Are you sure you want to delete?"
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>
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

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
  }
</style>
