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
    initialName = "",
    onConfirm,
  }: {
    initialName?: string
    onConfirm: (name: string) => Promise<void> | void
  } = $props()

  export const show = (nextName = initialName) => {
    name = nextName
    touched = false
    modal?.show()
  }

  export const hide = () => {
    modal?.hide()
  }

  const createOperation = async () => {
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
    title="New operation"
    confirmText="Create"
    disabled={!trimmedName}
    onConfirm={createOperation}
  >
    <Input
      label="Name"
      bind:value={name}
      error={nameError}
      on:input={() => (touched = true)}
      placeholder="Customer support"
    />
  </ModalContent>
</Modal>
