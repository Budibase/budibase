<script>
  import {
    Button,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  let modal
</script>

<Button icon="AddCircle" type="overBackground" size="S" quiet on:click={modal.show}>
  Create New Column
</Button>
<Modal bind:this={modal}>
  <ModalContent
    size="large"
    showCancelButton={false}
    showConfirmButton={false}
    title={'Create Column'}>
    <CreateEditColumn onClosed={modal.hide} />
  </ModalContent>
</Modal>
