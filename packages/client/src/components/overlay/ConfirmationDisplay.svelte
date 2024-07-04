<script>
import { Modal, ModalContent } from "@budibase/bbui"
import { confirmationStore } from "stores"
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
