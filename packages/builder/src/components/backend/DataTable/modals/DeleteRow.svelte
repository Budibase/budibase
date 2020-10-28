<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Icon, Modal } from "@budibase/bbui"
  import * as api from "../api"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let row

  let anchor
  let dropdown
  let confirmDeleteDialog

  function showDelete() {
    confirmDeleteDialog.show()
  }

  async function deleteRow() {
    await api.deleteRow(row)
    notifier.success("Row deleted")
    backendUiStore.actions.rows.delete(row)
  }
</script>

<div on:click={showDelete}><i class="ri-delete-row" /></div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this row? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Row"
  onOk={deleteRow}
  title="Confirm Delete" />

<style>
  .ri-delete-bin-line:hover {
    cursor: pointer;
  }

  div {
    display: flex;
    justify-content: center;
  }
</style>
