<script>
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"

  let visible = false
  let modal
</script>

<ActionButton on:click={modal.show}>Bindings</ActionButton>

<Modal bind:this={modal}>
  <ModalContent title="Bindings" showConfirmButton={false} cancelText="Close">
    Some awesome bindings content.
  </ModalContent>
</Modal>
