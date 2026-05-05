<script>
  import { Select, Label } from "@budibase/bbui"
  import { tables, datasources, viewsV2, rowActions } from "@/stores/builder"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import ConfirmationSettings from "./ConfirmationSettings.svelte"

  export let parameters
  export let bindings = []

  $: datasourceMap = Object.fromEntries(
    ($datasources.list || []).map(ds => [ds._id, ds.name])
  )
  $: tableOptions = $tables.list.map(table => {
    const datasourceName = datasourceMap[table.sourceId] || "Unknown"
    return {
      label: `${datasourceName} - ${table.name}`,
      resourceId: table._id,
    }
  })
  $: viewOptions = $viewsV2.list.map(view => {
    const table = $tables.list.find(t => t._id === view.tableId)
    const datasourceName = datasourceMap[table.sourceId] || "Unknown"
    return {
      label: `${datasourceName} - ${view.name}`,
      resourceId: view.id,
    }
  })
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

    <ConfirmationSettings {parameters} {bindings} />
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
