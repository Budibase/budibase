<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CreateViewModal from "../modals/CreateViewModal.svelte"

  export let disabled = false

  let modal
</script>

<ActionButton
  {disabled}
  icon="CollectionAdd"
  size="S"
  quiet
  on:click={modal.show}
>
  Create view
</ActionButton>
<Modal bind:this={modal}>
  <CreateViewModal />
</Modal>
