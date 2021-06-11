<script>
  import { Button, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let selectedRows
  export let deleteRows

  let modal

  async function confirmDeletion() {
    await deleteRows()
    modal?.hide()
  }
</script>

<Button icon="Delete" size="s" primary quiet on:click={modal.show}>
  Delete
  {selectedRows.length}
  row(s)
</Button>
<ConfirmDialog
  bind:this={modal}
  okText="Delete"
  onOk={confirmDeletion}
  title="Confirm Deletion"
>
  Are you sure you want to delete
  {selectedRows.length}
  row{selectedRows.length > 1 ? "s" : ""}?
</ConfirmDialog>
