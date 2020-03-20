<script>
  import Button from "./Button.svelte"
  import ActionButton from "./ActionButton.svelte"
  import ButtonGroup from "./ButtonGroup.svelte"
  import UIkit from "uikit"

  export let title = ""
  export let body = ""
  export let okText = "OK"
  export let cancelText = "Cancel"
  export let onOk = () => {}
  export let onCancel = () => {}

  export const show = () => {
    uiKitModal.hide()
    uiKitModal.show()
  }

  export const hide = () => {
    uiKitModal.hide()
  }

  let theModal
  $: uiKitModal = theModal && UIkit.modal(theModal)

  const cancel = () => {
    hide()
    onCancel()
  }

  const ok = () => {
    hide()
    onOk()
  }
</script>

<div id={title} uk-modal bind:this={theModal}>
  <div class="uk-modal-dialog">
    <button class="uk-modal-close-default" type="button" uk-close />
    <div class="uk-modal-header">
      <h4 class="budibase__title--4">{title}</h4>
    </div>
    <div class="uk-modal-body">
      <slot class="rows">{body}</slot>
    </div>
    <div class="uk-modal-footer">
      <ButtonGroup>
        <ActionButton cancel on:click={cancel}>{cancelText}</ActionButton>
        <ActionButton primary on:click={ok}>{okText}</ActionButton>
      </ButtonGroup>
    </div>
  </div>
</div>

<style>

.uk-modal-footer {
  background: var(--lightslate);
}

.uk-modal-dialog {
  width: 400px;
  border-radius: 5px;
}

</style>
