<script>
  import { Modal, ModalContent, Body } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  export let title = ""
  export let body = ""
  export let okText = $t("confirm")
  export let cancelText = $t("cancel")
  export let onOk = undefined
  export let onCancel = undefined
  export let warning = true

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
  >
    <Body size="S">
      {body}
      <slot />
    </Body>
  </ModalContent>
</Modal>
