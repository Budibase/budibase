<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"

  export let title = ""
  export let body = ""
  export let okText = "Confirm"
  export let cancelText = "Cancel"
  export let onOk = undefined
  export let onCancel = undefined
  export let warning = true
  export let disabled

  let modal

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    onConfirm={onOk}
    {title}
    confirmText={okText}
    {cancelText}
    {warning}
    {disabled}
  >
    <Body size="S">
      {body}
      <slot />
    </Body>
  </ModalContent>
</Modal>
