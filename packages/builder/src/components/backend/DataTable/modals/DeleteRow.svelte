<script>
  import { rows } from "stores/backend"
  import * as api from "../api"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let row

  let confirmDeleteDialog

  function showDelete() {
    confirmDeleteDialog.show()
  }

  async function deleteRow() {
    await api.deleteRow(row)
    notifications.success("Row deleted")
    rows.delete(row)
  }
</script>

<div on:click={showDelete}><i class="ri-delete-row" /></div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this row? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Row"
  onOk={deleteRow}
  title="Confirm Deletion" />

<style>
  div {
    display: flex;
    justify-content: center;
  }
</style>
