<script>
  import { confirmationStore } from "@/stores"
  import { Modal, ModalContent, MarkdownViewer } from "@budibase/bbui"

  const stringify = text => {
    if (text == null) {
      return ""
    }
    if (typeof text !== "string") {
      try {
        return JSON.stringify(text)
      } catch (e) {
        return ""
      }
    }
    return text
  }
</script>

{#if $confirmationStore.showConfirmation}
  <Modal fixed on:cancel={confirmationStore.actions.cancel}>
    <ModalContent
      title={$confirmationStore.title}
      onConfirm={confirmationStore.actions.confirm}
      confirmText={$confirmationStore.confirmButtonText}
      cancelText={$confirmationStore.cancelButtonText}
    >
      <MarkdownViewer value={stringify($confirmationStore.text)} />
    </ModalContent>
  </Modal>
{/if}
