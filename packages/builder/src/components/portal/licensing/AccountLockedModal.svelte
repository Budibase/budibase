<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"

  let modal

  export let onConfirm

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }
</script>

<Modal bind:this={modal} on:hide={modal}>
  <ModalContent
    title="Your account is currently de-activated"
    size="S"
    showCancelButton={true}
    showCloseIcon={false}
    confirmText={"View plans"}
    {onConfirm}
  >
    <Body size="S"
      >Due to the free plan user limit being exceeded, your account has been
      de-activated. Upgrade your plan to re-activate your account.</Body
    >
  </ModalContent>
</Modal>
