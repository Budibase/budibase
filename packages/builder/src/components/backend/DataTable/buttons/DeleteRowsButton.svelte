<script>
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { _ as t } from "svelte-i18n"

  export let selectedRows
  export let deleteRows

  let modal

  async function confirmDeletion() {
    await deleteRows()
    modal?.hide()
  }
</script>

<Button icon="Delete" size="s" primary quiet on:click={modal.show}>
  {$t("delete")}
  {selectedRows.length}
  {$t("row-s")}
</Button>
<ConfirmDialog
  bind:this={modal}
  okText={$t("delete")}
  onOk={confirmDeletion}
  title={$t("confirm-deletion")}
>
  {$t("are-you-sure-you-want-to-delete")}
  {selectedRows.length}
  {$t("row")}{selectedRows.length > 1 ? "s" : ""}?
</ConfirmDialog>
