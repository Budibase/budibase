<script>
  import { Button, Modal, ModalContent } from "@budibase/bbui"

  let modal

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }
</script>

<Modal bind:this={modal} width="60%">
  <ModalContent
    title="Edit Code"
    showConfirmButton={false}
    showCancelButton={false}>
    <div class="container">
      <slot />
    </div>
  </ModalContent>
</Modal>
<Button primary on:click={show}>Edit Code</Button>

<style>
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }
  .container :global(textarea) {
    min-height: 60px;
  }
</style>
