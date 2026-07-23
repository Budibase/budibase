<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import {
    Input,
    keepOpen,
    Modal,
    ModalContent,
    type ModalAPI,
  } from "@budibase/bbui"

  interface ShowOptions {
    title: string
    confirmText: string
    name?: string
    onConfirm: (_name: string) => Promise<void>
  }

  let modal: ModalAPI
  let modalContent: ModalContent
  let title = ""
  let confirmText = ""
  let name = ""
  let error = ""
  let saving = false
  let onConfirm: ShowOptions["onConfirm"] = async () => {}

  export const show = (options: ShowOptions) => {
    title = options.title
    confirmText = options.confirmText
    name = options.name || ""
    onConfirm = options.onConfirm
    error = ""
    saving = false
    modal.show()
  }

  const save = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || saving) {
      return keepOpen
    }
    saving = true
    error = ""
    try {
      await onConfirm(trimmedName)
      modal.hide()
    } catch (saveError) {
      error = getErrorMessage(saveError) || "Unable to save Function"
      return keepOpen
    } finally {
      saving = false
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    bind:this={modalContent}
    {title}
    {confirmText}
    showConfirmButton
    showCancelButton
    showCloseIcon
    disabled={saving || !name.trim()}
    onConfirm={save}
  >
    <form
      on:submit|preventDefault={() => {
        if (name.trim() && !saving) {
          modalContent.confirm()
        }
      }}
    >
      <Input
        label="Name"
        bind:value={name}
        {error}
        placeholder="Customer lookup"
      />
    </form>
  </ModalContent>
</Modal>
