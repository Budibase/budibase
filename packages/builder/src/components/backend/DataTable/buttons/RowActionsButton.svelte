<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import RowActionsModal from "../modals/RowActionsModal.svelte"
  import { rowActions } from "stores/builder/rowActions"

  export let tableId
  let modal

  $: rowActions.fetch(tableId)

  async function openModal() {
    modal.show()
  }

  $: rowActionsList = $rowActions.list
  $: hasRowActions = rowActionsList > 0
  $: title =
    "Row actions" + (hasRowActions ? ` (${rowActionsList.length})` : "")
</script>

<ActionButton icon="JourneyAction" quiet on:click={openModal}>
  {title}
</ActionButton>
<Modal bind:this={modal}>
  <RowActionsModal />
</Modal>
