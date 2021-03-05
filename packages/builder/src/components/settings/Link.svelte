<script>
  import SettingsModal from "./SettingsModal.svelte"
  import { Modal } from "@budibase/bbui"

  let modal
</script>

<div
  class="topnavitemright settings"
  data-cy="settings-icon"
  on:click={modal.show}>
  <i class="ri-settings-3-line" />
</div>
<Modal bind:this={modal} width="600px">
  <SettingsModal />
</Modal>

<style>
  i {
    font-size: 18px;
    color: var(--grey-7);
  }
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
  .topnavitemright:hover i {
    color: var(--ink);
  }
</style>
