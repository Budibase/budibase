<script>
  import { Modal, ModalTitle, ModalFooter } from "components/common/Modal"

  export let title = ""
  export let body = ""
  export let okText = "Confirm"
  export let cancelText = "Cancel"
  export let onOk = () => {}
  export let onCancel = () => {}

  let modal

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }
</script>

<Modal id={title} bind:this={modal} on:hide={onCancel}>
  <ModalTitle>{title}</ModalTitle>
  <div class="body">{body}</div>
  <ModalFooter confirmText={okText} {cancelText} onConfirm={onOk} red />
</Modal>

<style>
  .body {
    font-size: var(--font-size-s);
  }
</style>
