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

  const component = getContext("component")
  const { styleable, API, builderStore } = getContext("sdk")
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
  }
  div.in-builder :global(*) {
    pointer-events: none;
  }
</style>
