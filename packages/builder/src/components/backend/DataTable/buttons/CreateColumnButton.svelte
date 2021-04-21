<script>
  import { Button, Icon, Modal, ModalContent } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  let modal
</script>

<Button icon="AddCircle" primary size="S" quiet on:click={modal.show}>
  Create New Column
</Button>
<Modal bind:this={modal}>
  <CreateEditColumn />
</Modal>
