<script>
  import SettingsModal from "./SettingsModal.svelte"
  import { SettingsIcon } from "components/common/Icons/"
  import { Modal } from "components/common/Modal"

  let modalVisible
</script>

<span class="topnavitemright settings" on:click={() => (modalVisible = true)}>
  <SettingsIcon />
</span>
{#if modalVisible}
  <SettingsModal bind:visible={modalVisible} />
{/if}

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
