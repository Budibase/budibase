<script>
  import { createEventDispatcher } from "svelte"
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { _ } from "../../../../../lang/i18n"

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

<Button icon="Delete" size="s" warning quiet on:click={modal.show}>
  {$_("components.backend.DataTable.buttons.DeleteRowsButton.Delete")}
  {selectedRows.length}
  {text}
</Button>
<ConfirmDialog
  bind:this={modal}
  okText={$_("components.backend.DataTable.buttons.DeleteRowsButton.Delete")}
  onOk={confirmDeletion}
  title={$_(
    "components.backend.DataTable.buttons.DeleteRowsButton.Confirm_Deletion"
  )}
>
  {$_("components.backend.DataTable.buttons.DeleteRowsButton.want_delete")}
  {selectedRows.length}
  {text}?
</ConfirmDialog>
