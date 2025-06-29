<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { environment } from "@/stores/portal"
  import CreateEditVariableModal from "@/components/portal/environment/CreateEditVariableModal.svelte"

  export let row

  let editVariableModal
  let deleteDialog

  const save = async data => {
    const { name, ...rest } = data
    await environment.updateVariable(name, rest)
    editVariableModal.hide()
  }
</script>

<ActionButton size="S" on:click={editVariableModal.show}>Edit</ActionButton>

<Modal bind:this={editVariableModal}>
  <CreateEditVariableModal {row} {save} />
</Modal>

<ConfirmDialog
  bind:this={deleteDialog}
  onOk={async () => {
    await environment.deleteVariable(row.name)
  }}
  okText="Delete Environment Variable"
  title="Confirm Deletion"
>
  Are you sure you wish to delete the environment variable
  <i>{row.name}?</i>
  This action cannot be undone.
</ConfirmDialog>
