<script lang="ts">
  import { Input, keepOpen, Modal, ModalContent } from "@budibase/bbui"

  let modal: Modal
  let name = $state("")
  let touched = $state(false)

  let trimmedName = $derived(name.trim())
  let nameError = $derived(
    touched && !trimmedName ? "Operation name is required" : undefined
  )

  let {
    onConfirm,
  }: {
    onConfirm: (name: string) => Promise<void> | void
  } = $props()

  export const show = (initialName = "") => {
    name = initialName
    touched = false
    modal?.show()
  }

  export const hide = () => {
    modal?.hide()
  }

  const renameOperation = async () => {
    touched = true
    if (!trimmedName) {
      return keepOpen
    }

    await onConfirm(trimmedName)
    modal?.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Rename operation"
    confirmText="Save"
    disabled={!trimmedName}
    onConfirm={renameOperation}
  >
    <Input label="Name" bind:value={name} error={nameError} />
  </ModalContent>
</Modal>
