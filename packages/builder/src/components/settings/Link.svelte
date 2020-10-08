<script>
  import SettingsModal from "./SettingsModal.svelte"
  import { SettingsIcon } from "components/common/Icons/"
  import { Modal } from "@budibase/bbui"

  let modal
</script>

<span class="topnavitemright settings" on:click={modal.show}>
  <SettingsIcon />
</span>
<Modal bind:this={modal} width="600px">
  <SettingsModal />
</Modal>

<style>
  span:first-letter {
    text-transform: capitalize;
  }
  .topnavitemright {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 20px 0 0;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    box-sizing: border-box;
  }
</style>
