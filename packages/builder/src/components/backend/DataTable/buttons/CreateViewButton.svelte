<script>
  import { Modal, Button } from "@budibase/bbui"
  import CreateViewModal from "../modals/CreateViewModal.svelte"

  let modal
</script>

<Button icon="CollectionAdd" primary size="S" quiet on:click={modal.show}>
  Create New View
</Button>
<Modal bind:this={modal}>
  <CreateViewModal />
</Modal>
