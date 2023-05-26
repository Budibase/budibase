<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ImportModal from "../modals/ImportModal.svelte"

  export let tableId
  export let tableType
  export let disabled

  let modal
</script>

<ActionButton icon="DataUpload" quiet on:click={modal.show} {disabled}>
  Import
</ActionButton>
<Modal bind:this={modal}>
  <ImportModal {tableId} {tableType} on:importrows />
</Modal>
