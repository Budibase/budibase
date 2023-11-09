<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext } from "svelte"
  import { Grid } from "@budibase/frontend-core"

  // table is actually any datasource, but called table for legacy compatibility
  export let table
  export let allowAddRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true
  export let stripeRows = false
  export let initialFilter = null
  export let initialSortColumn = null
  export let initialSortOrder = null
  export let fixedRowHeight = null
  export let columns = null
  export let onRowClick = null
  
  // parses columns to fix older formats
  const getParsedColumns = (columns) => {
    // If the first element has an active key all elements should be in the new format
    if (columns?.length && columns[0]?.active !== undefined) {
      return columns;
    }

    return columns?.map(column => ({
      label: column.displayName,
      field: column.name,
      active: true
    }));
  }

  $: parsedColumns = getParsedColumns(columns);

  const component = getContext("component")
  const { styleable, API, builderStore, notificationStore } = getContext("sdk")

  $: columnWhitelist = parsedColumns?.filter(col => col.active)?.map(col => col.field)
  $: schemaOverrides = getSchemaOverrides(parsedColumns)

  const getSchemaOverrides = columns => {
    let overrides = {}
    columns?.forEach(column => {
      overrides[column.field] = {
        displayName: column.label,
      }
    })
    return overrides
  }
</script>

<div
  use:styleable={$component.styles}
  class:in-builder={$builderStore.inBuilder}
>
  <Grid
    datasource={table}
    {API}
    {stripeRows}
    {initialFilter}
    {initialSortColumn}
    {initialSortOrder}
    {fixedRowHeight}
    {columnWhitelist}
    {schemaOverrides}
    canAddRows={allowAddRows}
    canEditRows={allowEditRows}
    canDeleteRows={allowDeleteRows}
    canEditColumns={false}
    canExpandRows={false}
    canSaveSchema={false}
    showControls={false}
    notifySuccess={notificationStore.actions.success}
    notifyError={notificationStore.actions.error}
    on:rowclick={e => onRowClick?.({ row: e.detail })}
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    overflow: hidden;
    min-height: 410px;
  }
  div.in-builder :global(*) {
    pointer-events: none;
  }
</style>
