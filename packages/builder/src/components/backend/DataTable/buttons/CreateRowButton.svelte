<script>
  import { TextButton as Button, Icon, Modal } from "@budibase/bbui"
  import CreateEditRowModal from "../modals/CreateEditRowModal.svelte"

  let modal
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<Modal bind:this={modal}>
  <CreateEditRowModal />
</Modal>
