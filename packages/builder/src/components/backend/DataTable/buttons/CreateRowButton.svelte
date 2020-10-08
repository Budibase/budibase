<script>
  import { TextButton as Button, Icon, Modal } from "@budibase/bbui"
  import CreateEditRecordModal from "../modals/CreateEditRecordModal.svelte"

  let modal
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<Modal bind:this={modal}>
  <CreateEditRecordModal />
</Modal>
