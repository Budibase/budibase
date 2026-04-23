<script lang="ts">
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import type { AgentTestGroup } from "@budibase/types"

  type Props = {
    onSave: (_group: AgentTestGroup | Omit<AgentTestGroup, "id">) => Promise<boolean>
  }

  let { onSave }: Props = $props()

  let modal: Modal
  let loading = $state(false)
  let name = $state("")
  let groupId = $state<string | null>(null)

  const validate = (value: string) => value.trim().length > 0

  export const show = (group?: AgentTestGroup) => {
    groupId = group?.id ?? null
    name = group?.name ?? ""
    loading = false
    modal.show()
  }

  const handleConfirm = async () => {
    if (loading || !validate(name)) {
      return
    }

    loading = true
    try {
      const saved = await onSave(
        groupId ? { id: groupId, name } : { name }
      )
      if (!saved) {
        return
      }
      modal.hide()
    } catch (error) {
      console.error("Failed to save test group", error)
      notifications.error("Failed to save test group")
    } finally {
      loading = false
    }
  }

  let editing = $derived(groupId != null)
  let error = $derived(validate(name) ? "" : "Name is required")
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={editing ? "Rename test group" : "Create new test group"}
    confirmText={editing ? "Save" : "Create"}
    cancelText="Cancel"
    onConfirm={handleConfirm}
    disabled={loading || !!error}
    size="M"
  >
    <Input
      bind:value={name}
      label="Name"
      placeholder="Test group"
      {error}
    />
  </ModalContent>
</Modal>
