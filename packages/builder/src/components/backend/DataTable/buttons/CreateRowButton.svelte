<script>
  import { TextButton as Button, Icon } from "@budibase/bbui"
  import CreateEditRecordModal from "../modals/CreateEditRecordModal.svelte"
  import { Modal } from "components/common/Modal"

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
