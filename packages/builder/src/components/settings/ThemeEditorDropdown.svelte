<script>
  import { Icon, Label, Modal, ModalContent } from "@budibase/bbui"
  import ThemeEditor from "./ThemeEditor.svelte"

  let modal
</script>

<div class="topnavitemright" on:click={modal.show}>
  <Icon hoverable name="ColorFill" />
</div>
<Modal bind:this={modal}>
  <ModalContent
    title="Builder Theme"
    confirmText="Done"
    showCancelButton={false}>
    <ThemeEditor />
  </ModalContent>
</Modal>

<style>
  .topnavitemright {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 12px 0 0;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
  }
</style>
