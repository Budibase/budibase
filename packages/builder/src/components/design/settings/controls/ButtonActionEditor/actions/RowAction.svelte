<script>
  import { Select, Label, Checkbox } from "@budibase/bbui"
  import { tables, viewsV2, rowActions } from "@/stores/builder"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    tableId: view.tableId,
    resourceId: view.id,
  }))
  $: datasourceOptions = [...(tableOptions || []), ...(viewOptions || [])]
  $: resourceId = parameters.resourceId
  $: rowActions.refreshRowActions(resourceId)
  $: enabledRowActions = $rowActions[resourceId] || []
  $: rowActionOptions = enabledRowActions.map(action => ({
    label: action.name,
    value: action.id,
  }))
</script>

<div class="root">
  <div class="params">
    <Label>Table or view</Label>
    <Select
      bind:value={parameters.resourceId}
      options={datasourceOptions}
      getOptionLabel={x => x.label}
      getOptionValue={x => x.resourceId}
    />

    <Label small>Row ID</Label>
    <DrawerBindableInput
      {bindings}
      title="Row ID"
      value={parameters.rowId}
      on:change={value => (parameters.rowId = value.detail)}
    />

    <Label small>Row action</Label>
    <Select bind:value={parameters.rowActionId} options={rowActionOptions} />

    <br />
    <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small>Title</Label>
      <DrawerBindableInput
        placeholder="Prompt User"
        value={parameters.customTitleText}
        on:change={e => (parameters.customTitleText = e.detail)}
        {bindings}
      />
      <Label small>Text</Label>
      <DrawerBindableInput
        placeholder="Are you sure you want to continue?"
        value={parameters.confirmText}
        on:change={e => (parameters.confirmText = e.detail)}
        {bindings}
      />
      <Label small>Confirm Text</Label>
      <DrawerBindableInput
        placeholder="Confirm"
        value={parameters.confirmButtonText}
        on:change={e => (parameters.confirmButtonText = e.detail)}
        {bindings}
      />
      <Label small>Cancel Text</Label>
      <DrawerBindableInput
        placeholder="Cancel"
        value={parameters.cancelButtonText}
        on:change={e => (parameters.cancelButtonText = e.detail)}
        {bindings}
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
