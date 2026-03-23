<script lang="ts">
  import { Modal, ModalContent, Body } from "@budibase/bbui"

  let modal: Modal

  export let onConfirm: (() => Promise<any> | any) | undefined

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }
</script>

<Modal bind:this={modal}>
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
