<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Modal } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"
  import * as api from "../api"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let row

  let anchor
  let dropdown
  let confirmDeleteDialog
  let modal

  function showModal() {
    dropdown.hide()
    modal.show()
  }

  function showDelete() {
    dropdown.hide()
    confirmDeleteDialog.show()
  }

  async function deleteRow() {
    await api.deleteRow(row)
    notifier.success("Row deleted")
    backendUiStore.actions.rows.delete(row)
  }
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <DropdownContainer>
    <DropdownItem
      icon="ri-edit-line"
      title="Edit"
      on:click={showModal}
      data-cy="edit-row" />
    <DropdownItem
      icon="ri-delete-bin-line"
      title="Delete"
      on:click={showDelete}
      data-cy="delete-row" />
  </DropdownContainer>
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this row? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Row"
  onOk={deleteRow}
  title="Confirm Delete" />
<Modal bind:this={modal}>
  <CreateEditRowModal {row} />
</Modal>

<style>
  .ri-more-line:hover {
    cursor: pointer;
  }
</style>
