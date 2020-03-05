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
    UIkit.modal(theModal).show()
  }

  export const hide = () => {
    UIkit.modal(theModal).hide()
  }

  let theModal

  const cancel = () => {
    hide()
    onCancel()
  }

  const ok = () => {
    hide()
    onOk()
  }
</script>

<div id="my-id" uk-modal bind:this={theModal}>
  <div class="uk-modal-dialog">
    <button class="uk-modal-close-default" type="button" uk-close />
    <div class="uk-modal-header">
      <h4 class="budibase__title--4">{title}</h4>
    </div>
    <div class="uk-modal-body">
      <slot>{body}</slot>
    </div>
    <div class="uk-modal-footer">
      <ButtonGroup>
        <ActionButton primary on:click={ok}>{okText}</ActionButton>
        <ActionButton alert on:click={cancel}>{cancelText}</ActionButton>
      </ButtonGroup>
    </div>
  </div>
</div>
