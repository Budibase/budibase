<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  export let highlighted = false
  export let disabled = false

  let modal

  export const show = () => modal?.show()
</script>

<ActionButton
  {disabled}
  selected={highlighted}
  emphasized={highlighted}
  icon="TableColumnAddRight"
  quiet
  on:click={modal.show}
>
  Create column
</ActionButton>
<Modal bind:this={modal}>
  <CreateEditColumn on:updatecolumns />
</Modal>
