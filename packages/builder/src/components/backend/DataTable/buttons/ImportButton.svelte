<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ImportModal from "../modals/ImportModal.svelte"

  export let tableId

  let modal
</script>

<ActionButton icon="DataUpload" size="S" quiet on:click={modal.show}>
  Import
</ActionButton>
<Modal bind:this={modal}>
  <ImportModal {tableId} on:updaterows />
</Modal>
