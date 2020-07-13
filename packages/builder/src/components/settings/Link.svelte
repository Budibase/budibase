<script>
  import Modal from "./Modal.svelte"
  import { SettingsIcon } from "components/common/Icons/"
  import { getContext } from "svelte"
  import { isActive, goto, layout } from "@sveltech/routify"

  // Handle create app modal
  const { open } = getContext("simple-modal")

  const showSettingsModal = () => {
    open(
      Modal,
      {
        name: "Placeholder App Name",
        description: "This is a hardcoded description that needs to change",
      },
      {
        closeButton: false,
        closeOnEsc: true,
        styleContent: { padding: 0 },
        closeOnOuterClick: true,
      }
    )
  }
</script>

<span class="topnavitemright" on:click={showSettingsModal}>
  <SettingsIcon />
</span>

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
