<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ImportModal from "../modals/ImportModal.svelte"

  export let tableId
  export let disabled

  let modal
</script>

<ActionButton icon="DataUpload" size="S" quiet on:click={modal.show} {disabled}>
  Import
</ActionButton>
<Modal bind:this={modal}>
  <ImportModal {tableId} on:updaterows />
</Modal>
