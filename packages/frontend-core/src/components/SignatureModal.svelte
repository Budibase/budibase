<script>
  import { Modal, ModalContent, Body, CoreSignature } from "@budibase/bbui"

  export let onConfirm = () => {}
  export let value
  export let title
  export let darkMode

  export const show = () => {
    modal.show()
  }

  let modal
  let canvas
</script>

<Modal bind:this={modal}>
  <ModalContent
    showConfirmButton
    showCancelButton={false}
    showCloseIcon={false}
    custom
    showDivider={false}
    onConfirm={() => {
      onConfirm(canvas)
    }}
  >
    <div slot="header">
      <Body>{title}</Body>
    </div>
    <div class="signature-wrap modal">
      <CoreSignature {darkMode} {value} saveIcon={false} bind:this={canvas} />
    </div>
  </ModalContent>
</Modal>

<style>
  .signature-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-alias-text-color);
    box-sizing: border-box;
    position: relative;
  }
</style>
