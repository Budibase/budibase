<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Icon, Modal, Button } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"

  export let row

  let anchor
  let dropdown
  let confirmDeleteDialog
  let modal

  function showModal(e) {
    e.stopPropagation()
    modal.show()
  }
</script>

<Button translucent small on:click={showModal}>Edit</Button>
<Modal bind:this={modal}>
  <CreateEditRowModal {row} />
</Modal>
