<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ImportModal from "../modals/ImportModal.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let tableId
  export let disabled

  let modal
</script>

<ActionButton icon="DataUpload" size="S" quiet on:click={modal.show} {disabled}>
  {$_("components.backend.DataTable.buttons.ImportButon.Import")}
</ActionButton>
<Modal bind:this={modal}>
  <ImportModal {tableId} on:importrows />
</Modal>
