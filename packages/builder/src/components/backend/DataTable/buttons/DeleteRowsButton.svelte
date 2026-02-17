<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Button } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  interface ModalRef {
    show: () => void
    hide: () => void
  }

  export let selectedRows: unknown[] = []
  export let deleteRows: (_rows: unknown[]) => void | Promise<void>
  export let item: string = "row"
  export let action: string = "Delete"

  const dispatch = createEventDispatcher()
  let modal: ModalRef | undefined

  async function confirmDeletion() {
    await deleteRows(selectedRows)
    modal?.hide()
    dispatch("updaterows")
  }

  $: text = `${item}${selectedRows?.length === 1 ? "" : "s"}`
  $: actionText = action.toLowerCase()
</script>

<Button icon="trash" warning quiet on:click={modal.show}>
  {action}
  {selectedRows.length}
  {text}
</Button>
<ConfirmDialog
  bind:this={modal}
  okText={action}
  onOk={confirmDeletion}
  title={`Confirm ${action}`}
>
  Are you sure you want to {actionText}
  {selectedRows.length}
  {text}?
</ConfirmDialog>
