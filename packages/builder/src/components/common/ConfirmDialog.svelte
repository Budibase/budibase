<script>
  import UIkit from "uikit"
  import { Modal, Button, Heading } from "@budibase/bbui"

  export let title = ""
  export let body = ""
  export let okText = "OK"
  export let cancelText = "Cancel"
  export let onOk = () => {}
  export let onCancel = () => {}

  export const show = () => {
    theModal.show()
  }

  export const hide = () => {
    theModal.hide()
  }

  let theModal

  const cancel = () => {
    hide()
    onCancel()
  }

  const ok = () => {
    const result = onOk()
    // allow caller to return false, to cancel the "ok"
    if (result === false) return
    hide()
  }
</script>

<Modal id={title} bind:this={theModal}>

  <h2>{title}</h2>

  <div class="modal-body">
    <slot class="rows">{body}</slot>
  </div>

  <div class="modal-footer">
    <Button red wide on:click={ok}>{okText}</Button>
    <Button secondary wide on:click={cancel}>{cancelText}</Button>
  </div>

</Modal>

<style>
  h2 {
    font-size: var(--font-size-xl);
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 600;
  }

  .modal-body {
    margin-top: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .modal-footer {
    display: grid;
    grid-gap: var(--spacing-s);
  }
</style>
