<script>
  import { TextButton as Button, Modal } from "@budibase/bbui"
  import BuilderSettingsModal from "./BuilderSettingsModal.svelte"

  let modal
</script>

<div>
  <Button text on:click={modal.show}>
    <i class="ri-settings-3-fill"></i>
    <p>Settings</p>
  </Button>
</div>
<Modal bind:this={modal} width="30%">
  <BuilderSettingsModal />
</Modal>

<style>
  div i {
    font-size: 26px;
    color: var(--grey-7);
    margin-left: 12px;
  }

  div p {
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--ink);
    font-weight: 400;
    margin: 0 0 0 12px;
  }
</style>
