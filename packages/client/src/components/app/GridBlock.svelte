<script>
  // NOTE: this is not a block - it's just named as such to avoid confusing users,
  // because it functions similarly to one
  import { getContext } from "svelte"
  import { Grid } from "@budibase/frontend-core"

  export let table
  export let allowAddRows
  export let allowEditRows
  export let allowDeleteRows

  const component = getContext("component")
  const { styleable, API } = getContext("sdk")
</script>

<div use:styleable={$component.styles}>
  <Grid
    tableId={table?.tableId}
    {API}
    {allowAddRows}
    {allowEditRows}
    {allowDeleteRows}
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
  }
</style>
