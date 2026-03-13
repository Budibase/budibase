<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import { environment } from "@/stores/portal/environment"
  import CreateEditVariableModal from "@/components/portal/environment/CreateEditVariableModal.svelte"

  export let row

  let editVariableModal

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
