<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import RowActionsModal from "../modals/RowActionsModal.svelte"

  let modal

  function openModal() {
    modal.show()
  }
</script>

<ActionButton icon="JourneyAction" quiet on:click={openModal}>
  Row actions
</ActionButton>
<Modal bind:this={modal}>
  <RowActionsModal />
</Modal>
