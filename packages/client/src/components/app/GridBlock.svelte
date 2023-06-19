<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext } from "svelte"
  import { Grid } from "@budibase/frontend-core"

  export let table
  export let allowAddRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true
  export let stripeRows = false
  export let initialFilter = null
  export let initialSortColumn = null
  export let initialSortOrder = null
  export let initialRowHeight = null
  export let columns = null

  const component = getContext("component")
  const { styleable, API, builderStore } = getContext("sdk")

  $: columnWhitelist = columns?.map(col => col.name)
  $: schemaOverrides = getSchemaOverrides(columns)

  const getSchemaOverrides = columns => {
    let overrides = {}
    columns?.forEach(column => {
      overrides[column.name] = {
        displayName: column.displayName || column.name,
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
    tableId={table?.tableId}
    {API}
    {allowAddRows}
    {allowEditRows}
    {allowDeleteRows}
    {stripeRows}
    {initialFilter}
    {initialSortColumn}
    {initialSortOrder}
    {initialRowHeight}
    {columnWhitelist}
    {schemaOverrides}
    showControls={false}
    allowExpandRows={false}
    allowSchemaChanges={false}
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
