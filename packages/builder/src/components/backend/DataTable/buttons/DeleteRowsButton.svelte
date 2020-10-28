<script>
  import { TextButton, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

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
<ConfirmDialog
  bind:this={modal}
  okText="Delete"
  onOk={confirmDeletion}
  title="Confirm Delete">
  Are you sure you want to delete
  {selectedRows.length}
  row{selectedRows.length > 1 ? 's' : ''}?
</ConfirmDialog>
