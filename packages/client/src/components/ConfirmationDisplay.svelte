<script>
  import { confirmationStore } from "../store"
  import { Modal, ModalContent } from "@budibase/bbui"
</script>

{#if $confirmationStore.showConfirmation}
  <Modal fixed on:cancel={confirmationStore.actions.cancel}>
    <ModalContent
      title="Confirm Action"
      onConfirm={confirmationStore.actions.confirm}
    >
      {$confirmationStore.text}
    </ModalContent>
  </Modal>
{/if}
