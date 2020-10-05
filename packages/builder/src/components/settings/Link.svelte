<script>
  import SettingsModal from "./SettingsModal.svelte"
  import { SettingsIcon } from "components/common/Icons/"
  import { Modal } from "components/common/Modal"

  let modal
</script>

<span class="topnavitemright settings" on:click={modal.show}>
  <SettingsIcon />
</span>
<Modal bind:this={modal} wide>
  <SettingsModal />
</Modal>

<style>
  span:first-letter {
    text-transform: capitalize;
  }
  .topnavitemright {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0px 20px 0px 0px;
    padding-top: 4px;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    box-sizing: border-box;
  }
</style>
