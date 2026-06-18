<script lang="ts">
  import { Input, keepOpen, Modal, ModalContent } from "@budibase/bbui"

  let modal: Modal
  let name = $state("")
  let touched = $state(false)

  let {
    title,
    confirmText,
    placeholder = "",
    validateName = () => undefined,
    onConfirm,
  }: {
    title: string
    confirmText: string
    placeholder?: string
    validateName?: (name: string) => string | undefined
    onConfirm: (name: string) => Promise<void> | void
  } = $props()

  let trimmedName = $derived(name.trim())
  let nameError = $derived(
    touched
      ? !trimmedName
        ? "Operation name is required"
        : validateName(trimmedName)
      : undefined
  )

  export const show = (initialName = "") => {
    name = initialName
    touched = false
    modal?.show()
  }

  export const hide = () => {
    modal?.hide()
  }

  const submit = async () => {
    touched = true
    if (!trimmedName || nameError) {
      return keepOpen
    }

    await onConfirm(trimmedName)
    modal?.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    {title}
    {confirmText}
    disabled={!trimmedName || !!nameError}
    onConfirm={submit}
  >
    <Input
      label="Name"
      bind:value={name}
      error={nameError}
      on:input={() => (touched = true)}
      {placeholder}
    />
  </ModalContent>
</Modal>
