<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ImportModal from "../modals/ImportModal.svelte"

  export let table
  export let disabled

  let modal
</script>

<ActionButton icon="DataUpload" size="S" quiet on:click={modal.show} {disabled}>
  Import
</ActionButton>
<Modal bind:this={modal}>
  <ImportModal tableId={table?._id} tableType={table?.type} on:importrows />
</Modal>
