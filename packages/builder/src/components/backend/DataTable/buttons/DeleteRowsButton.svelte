<script>
  import { createEventDispatcher } from "svelte"
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let selectedRows
  export let deleteRows
  export let item = "row"

  const dispatch = createEventDispatcher()
  let modal

  async function confirmDeletion() {
    await deleteRows(selectedRows)
    modal?.hide()
    dispatch("updaterows")
  }

  $: text = `${item}${selectedRows?.length === 1 ? "" : "s"}`
</script>

<Button icon="Delete" warning quiet on:click={modal.show}>
  Delete
  {selectedRows.length}
  {text}
</Button>
<ConfirmDialog
  bind:this={modal}
  okText="Delete"
  onOk={confirmDeletion}
  title="Confirm Deletion"
>
  Are you sure you want to delete
  {selectedRows.length}
  {text}?
</ConfirmDialog>
