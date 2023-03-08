<script>
  import { Modal, Button } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"

  export let row
  export let modalContentComponent = CreateEditRow

  let modal

  function showModal(e) {
    e.stopPropagation()
    modal.show()
  }
</script>

<Button secondary small on:click={showModal}>Edit</Button>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} {row} />
</Modal>
