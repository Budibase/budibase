<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CreateViewModal from "../modals/CreateViewModal.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let disabled = false

  let modal
</script>

<ActionButton
  {disabled}
  icon="CollectionAdd"
  size="S"
  quiet
  on:click={modal.show}
>
  {$_("components.backend.DataTable.buttons.CreateViewButton.Create_view")}
</ActionButton>
<Modal bind:this={modal}>
  <CreateViewModal />
</Modal>
