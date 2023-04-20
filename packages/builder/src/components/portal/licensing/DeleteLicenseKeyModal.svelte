<script>
  import { _ } from "../../../../lang/i18n"
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
    <Body size="S"
      >{$_("components.portal.licensing.DeleteLicenseKeyModal.Are")}</Body
    >
    <Body size="S"
      >{$_("components.portal.licensing.DeleteLicenseKeyModal.This")}</Body
    >
  </ModalContent>
</Modal>

<style>
</style>
