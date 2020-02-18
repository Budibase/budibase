<script>
import Button from "./Button.svelte"
import ButtonGroup from "./ButtonGroup.svelte"
import UIkit from "uikit"

export let title=""
export let body=""
export let okText = "OK"
export let cancelText = "Cancel"
export let onOk = ()=> {}
export let onCancel = ()=> {}

export const show = () => {
  UIkit.modal(theModal).show()
}

export const hide = () => {
  UIkit.modal(theModal).hide()
}

let theModal;

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
    <button class="uk-modal-close-default" type="button" uk-close></button>
    <div class="uk-modal-header">
      <h2 class="uk-modal-title">{title}</h2>
    </div>
    <div class="uk-modal-body">{body}</div>
    <div class="uk-modal-footer">
      <ButtonGroup>
        <Button grouped color="primary" on:click={ok}>
          {okText}
        </Button>
        <Button grouped color="secondary" on:click={cancel}>
          {cancelText}
        </Button>
    </ButtonGroup>
    </div>
  </div>
</div>

