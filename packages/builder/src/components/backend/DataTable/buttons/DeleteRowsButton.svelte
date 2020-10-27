<script>
  import { TextButton, Icon, Modal, ModalContent } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"

  export let selectedRows
  export let deleteRows

  let modal

  async function confirmDeletion() {
    await deleteRows()
    modal.hide()
  }
</script>

<div>
  <TextButton small text on:click={modal.show}>
    <Icon name="delete" />
    Delete
    {selectedRows.length}
    row(s)
  </TextButton>
</div>
<Modal bind:this={modal}>
  <ModalContent
    red
    confirmText="Delete"
    onConfirm={confirmDeletion}
    title="Confirm Row Deletion">
    Are you sure you want to delete these
    {selectedRows.length}
    rows?
  </ModalContent>
</Modal>
