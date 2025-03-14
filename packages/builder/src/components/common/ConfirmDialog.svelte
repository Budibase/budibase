<script lang="ts">
  import { Modal, ModalContent, Body } from "@budibase/bbui"

  export let title: string = ""
  export let body: string = ""
  export let okText: string = "Confirm"
  export let cancelText: string = "Cancel"
  export let onOk: (() => void) | undefined = undefined
  export let onCancel: (() => void) | undefined = undefined
  export let warning: boolean = true
  export let disabled: boolean = false

  let modal: Modal

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
