<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  let modal
</script>

<ActionButton icon="TableColumnAddRight" quiet size="S" on:click={modal.show}>
  Create column
</ActionButton>
<Modal bind:this={modal}>
  <CreateEditColumn on:updatecolumns />
</Modal>
