<script>
  import { confirmationStore } from "stores"
  import { Modal, ModalContent } from "@budibase/bbui"
</script>

{#if $confirmationStore.showConfirmation}
  <Modal fixed on:cancel={confirmationStore.actions.cancel}>
    <ModalContent
      title={$confirmationStore.title}
      onConfirm={confirmationStore.actions.confirm}
      confirmText={$confirmationStore.confirmButtonText}
      cancelText={$confirmationStore.cancelButtonText}
    >
      {$confirmationStore.text}
    </ModalContent>
  </Modal>
{/if}
