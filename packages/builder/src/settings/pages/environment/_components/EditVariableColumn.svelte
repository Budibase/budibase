<script lang="ts">
  import { ActionButton, Modal, type ModalAPI } from "@budibase/bbui"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { environment } from "@/stores/portal/environment"
  import type { EnvVar } from "@/stores/portal/environment"
  import CreateEditVariableModal from "@/components/portal/environment/CreateEditVariableModal.svelte"

  interface Props {
    row: EnvVar
  }

  let { row }: Props = $props()
  let editVariableModal = $state<ModalAPI>()

  const save = async (data: CreateEnvironmentVariableRequest) => {
    const { name, ...rest } = data
    await environment.updateVariable(name, rest)
    editVariableModal?.hide()
  }
</script>

<ActionButton size="S" on:click={() => editVariableModal?.show()}>
  Edit
</ActionButton>

<Modal bind:this={editVariableModal}>
  <CreateEditVariableModal {row} {save} />
</Modal>
