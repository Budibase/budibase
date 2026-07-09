<script lang="ts">
  import { Input, keepOpen, Modal, ModalContent } from "@budibase/bbui"

  let modal: Modal
  let modalContent: ModalContent
  let name = $state("")
  let touched = $state(false)
  let submitting = $state(false)
  let submitError = $state<string | undefined>(undefined)

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
  let nameError = $derived.by(() => {
    if (submitError) {
      return submitError
    }

    if (!touched || submitting) {
      return undefined
    }

    if (!trimmedName) {
      return "Operation name is required"
    }

    return validateName(trimmedName)
  })

  const resetState = () => {
    touched = false
    submitting = false
    submitError = undefined
  }

  const cannotSubmit = () => {
    return !trimmedName || !!nameError || submitting
  }

  export const show = (initialName = "") => {
    name = initialName
    resetState()
    modal?.show()
  }

  export const hide = () => {
    resetState()
    modal?.hide()
  }

  const submit = async () => {
    touched = true
    submitError = undefined
    if (cannotSubmit()) {
      return keepOpen
    }

    submitting = true
    try {
      await onConfirm(trimmedName)
      modal?.hide()
    } catch (error) {
      submitError = error instanceof Error ? error.message : "Failed to save"
      return keepOpen
    } finally {
      submitting = false
    }
  }
  let isOpen = $state(false)

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === "Enter") {
      const activeEl = document.activeElement
      if (activeEl && activeEl.tagName === "INPUT") {
        submitError = undefined
        if (cannotSubmit()) {
          touched = true
          return
        }
        modalContent.confirm()
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal
  bind:this={modal}
  on:show={() => (isOpen = true)}
  on:hide={() => (isOpen = false)}
>
  <ModalContent
    bind:this={modalContent}
    {title}
    {confirmText}
    disabled={cannotSubmit()}
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
