<script>
  import { Modal, Button } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"

  export let row

  let modal

  function showModal(e) {
    e.stopPropagation()
    modal.show()
  }
</script>

<Button data-cy="edit-row" secondary small on:click={showModal}>Edit</Button>
<Modal bind:this={modal}>
  <CreateEditRowModal {row} />
</Modal>
