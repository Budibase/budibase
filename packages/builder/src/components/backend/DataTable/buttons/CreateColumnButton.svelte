<script>
  import {
    DropdownMenu,
    TextButton as Button,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  let modal
  let fieldName
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="addcolumn" />
    Create New Column
  </Button>
</div>
<Modal bind:this={modal}>
  <ModalContent
    showCancelButton={false}
    showConfirmButton={false}
    title={'Create Column'}>
    <CreateEditColumn onClosed={modal.hide} />
  </ModalContent>
</Modal>
