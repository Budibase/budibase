<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Icon, Modal } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"
  import * as api from "../api"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let row

  let anchor
  let dropdown
  let confirmDeleteDialog
  let modal

  function showModal() {
    modal.show()
  }

  function showDelete() {
    confirmDeleteDialog.show()
  }

  async function deleteRow() {
    await api.deleteRow(row)
    notifier.success("Row deleted")
    backendUiStore.actions.rows.delete(row)
  }
</script>

<div on:click={showModal}><i class="ri-more-line" /></div>
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
