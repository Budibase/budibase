<script>
  import { Button, Icon, Modal } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"

  export let modalContentComponent = CreateEditRow
  export let title = "Create New Row"

  let modal
</script>

<Button icon="Add" primary size="S" quiet on:click={modal.show}>
  {title}
</Button>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} />
</Modal>
