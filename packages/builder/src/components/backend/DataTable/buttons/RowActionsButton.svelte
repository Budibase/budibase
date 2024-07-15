<script>
  import { ActionButton } from "@budibase/bbui"
  import { rowActions } from "stores/builder"
  import RowActionsDrawer from "components/common/rowActions/RowActionsDrawer.svelte"

  export let tableId
  let drawer

  let drawerOpen = false

  $: rowActions.fetch(tableId)

  async function openDrawer() {
    drawer.show()
  }

  $: hasRowActions = $rowActions.list.length > 0
  $: title =
    "Row actions" + (hasRowActions ? ` (${$rowActions.list.length})` : "")
</script>

<ActionButton
  icon="JourneyAction"
  quiet
  selected={hasRowActions || drawerOpen}
  on:click={openDrawer}
>
  {title}
</ActionButton>
<RowActionsDrawer
  bind:drawer
  {tableId}
  {rowActions}
  on:drawerShow={() => (drawerOpen = true)}
  on:drawerHide={() => (drawerOpen = false)}
/>
