<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  export let highlighted = false
  export let disabled = false

  let modal
</script>

<ActionButton
  {disabled}
  selected={highlighted}
  emphasized={highlighted}
  icon="TableColumnAddRight"
  quiet
  size="S"
  on:click={modal.show}
>
  Create column
</ActionButton>
<Modal bind:this={modal}>
  <CreateEditColumn on:updatecolumns />
</Modal>
