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
    title="Confirm deletion"
    size="S"
    showCancelButton={true}
    confirmText={"Confirm"}
    {onConfirm}
  >
    <Body size="S">Are you sure you want to delete this license key?</Body>
    <Body size="S">This license key cannot be re-activated.</Body>
  </ModalContent>
</Modal>

<style>
</style>
