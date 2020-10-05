<script>
  import { Modal } from "components/common/Modal"

  export let title = ""
  export let body = ""
  export let okText = "Confirm"
  export let cancelText = "Cancel"
  export let onOk = () => {}
  export let onCancel = () => {}

  let visible = false

  export const show = () => {
    visible = true
  }
  export const hide = () => {
    visible = false
  }
</script>

<Modal
  id={title}
  bind:visible
  on:hide={onCancel}
  {title}
  confirmText={okText}
  {cancelText}
  onConfirm={onOk}
  red>
  <div class="body">{body}</div>
</Modal>

<style>
  .body {
    font-size: var(--font-size-s);
  }
</style>
