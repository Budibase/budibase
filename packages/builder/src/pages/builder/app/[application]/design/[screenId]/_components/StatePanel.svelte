<script>
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"

  let visible = false
  let modal
</script>

<ActionButton on:click={modal.show}>State</ActionButton>

<Modal bind:this={modal}>
  <ModalContent title="State" showConfirmButton={false} cancelText="Close">
    Some awesome state content.
  </ModalContent>
</Modal>
