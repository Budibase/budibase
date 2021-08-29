<script>
  import { Button, Modal, ModalContent } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  let modal

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="XL"
    title={$t("edit-code")}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="container">
      <slot />
    </div>
  </ModalContent>
</Modal>
<Button primary on:click={show}>{$t("edit-code")}</Button>

<style>
  .container :global(section > header) {
    /* Fix margin defined in BBUI as L rather than XL */
    margin-bottom: var(--spacing-xl);
  }
  .container :global(textarea) {
    min-height: 60px;
  }
</style>
