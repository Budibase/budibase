<script>
  import { TextButton as Button, Icon, Modal } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"

  export let modalContentComponent = CreateEditRow

  let modal
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} />
</Modal>
