<script>
  import { ActionButton } from "@budibase/bbui"
  import RowActionsDrawer from "components/common/rowActions/RowActionsDrawer.svelte"

  export let tableId
  let drawer

  let rowActions = []

  $: fetchRowActions(tableId)

  async function fetchRowActions(tableId) {
    rowActions = await API.fetchRowActions(tableId)
  }

  async function openDrawer() {
    drawer.show()
  }

  $: hasRowActions = rowActions > 0
  $: title = "Row actions" + (hasRowActions ? ` (${rowActions.length})` : "")
</script>

<ActionButton icon="JourneyAction" quiet on:click={openDrawer}>
  {title}
</ActionButton>
<RowActionsDrawer bind:drawer {rowActions} />
